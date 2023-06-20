import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { BiChevronDown, BiSearch } from "react-icons/bi";

import { Header, Notifs, NavBar } from "~/components/barrel";
import { useState } from "react";
import Image from "next/image";
import { prisma } from "~/server/db";
import type { BriefWithAll } from "~/utils/type";
import { aleatoirePP } from "~/utils/genertor";
import Router from "next/router";


export const getServerSideProps: GetServerSideProps<{
    briefs: BriefWithAll[]
}> = async function (context) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    let briefs

    if (session.superadmin || session.formateur) {
        briefs = await prisma.brief.findMany({
            include: {
                ressources: true,
                referentiel: true,
                tags: true,
                formateur: true
            }
        })
    }
    else {
        briefs = await prisma.brief.findMany({
            include: {
                ressources: true,
                referentiel: true,
                tags: true,
                formateur: true
            },
            where: {
                assignations: {
                    some: {
                        idUser: session.user.id
                    }
                }
            }
        })
    }

    return {
        props: {
            briefs: JSON.parse(JSON.stringify(briefs)) as BriefWithAll[]
        }
    }
};

const IndexBrief: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ briefs }) => {
    const [open, setOpen] = useState(false)
    const { data: sessionData } = useSession()

    const [selected, setSelected] = useState(0)

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
                <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px] mt-12">
                    <span className="flex w-full flex-row items-center justify-between mb-10">
                        <h1 className="text-4xl font-extrabold text-black w-full">Projets de la promo</h1>
                        <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[40%] flex flex-row justify-between items-center">
                            <BiSearch className="text-3xl text-black ml-4" />
                            <input
                                type='text'
                                name="promoDateStart"
                                className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                autoComplete="off"
                            />
                        </div>
                    </span>

                    <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <span className="flex w-[45%] flex-row items-center justify-start">
                                <button className={selected == 1 ? "text-sm text-white bg-[#0E6073] rounded-full px-5 py-3 mr-2" : "text-sm text-black bg-[#EDEDED] rounded-full px-5 py-3 mr-2"} onClick={() => setSelected(1)}>Brouillons</button>
                                <button className={selected == 2 ? "text-sm text-white bg-[#0E6073] rounded-full px-5 py-3 mr-2" : "text-sm text-black bg-[#EDEDED] rounded-full px-5 py-3 mr-2"} onClick={() => setSelected(2)}>Publiés</button>
                            </span>
                            <span className="flex w-[50%] flex-row items-center justify-end">
                                <div className="relative">
                                    <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] text-white rounded-lg" onClick={() => setOpen(!open)}>
                                        <p className="text-base mr-2">Tri par: Date de création</p>
                                        <BiChevronDown className="text-4xl" />
                                    </button>
                                    {open &&
                                        <div className="w-full absolute bg-white rounded-b-lg flex flex-col items-center divide-y divide-[#0E6073] border-2">
                                            <button className="text-sm text-[#0E6073] py-4">Promo 2 2022/2023</button>
                                            <button className="text-sm text-[#0E6073] py-4">Promo 3 2022/2023</button>
                                            <button className="text-sm text-[#0E6073] py-4">Promo 4 2022/2023</button>
                                        </div>
                                    }
                                </div>
                                {(sessionData?.formateur || sessionData?.superadmin) &&
                                    <Link href={`/admin/briefs/creer`} className="flex flex-row items-center justify-between px-5 py-3 ml-4 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">
                                        Créer un projet
                                    </Link>
                                }
                            </span>
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                            {briefs && briefs.length > 0 && briefs.map((item) => {
                                let pp = aleatoirePP();
                                if (item.formateur.image && item.formateur.image !== "") {
                                    pp = item.formateur.image
                                }

                                let briefIlu = "/promo.jpeg";
                                if (item.img && item.img !== "") {
                                    briefIlu = item.img
                                }

                                let description = item.desc
                                if (description.length > 100) {
                                    description = item.desc.slice(0, 100) + '...'
                                }

                                return (
                                    <div className="flex flex-col max-w-[500px] rounded-lg h-[400px] my-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:cursor-pointer transition hover:scale-[1.025]" onClick={() => void Router.push(`/briefs/${item.id}`)} key={item.id}>
                                        <Image width={300} height={300} loader={() => briefIlu} src={briefIlu} className="w-[100%] h-[200px] bg-center bg-cover object-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                                        <div className="m-5 text-start">
                                            <h3 className="text-lg text-black">{item.title}</h3>
                                            <div className="text-sm text-black" dangerouslySetInnerHTML={{ __html: description }} />
                                            <span className="flex flex-row justify-end items-center w-full mt-5">
                                                {pp.includes("http") ?
                                                    <Image width={300} height={300} loader={() => pp} src={pp} className="w-20 h-20 rounded-full object-cover mr-3" style={{ background: item.formateur.color }} alt="Photo de profil utilisateur" />
                                                    :
                                                    <div className="w-20 h-20 rounded-full mr-3 flex items-center justify-center" style={{ background: item.formateur.color }}>
                                                        <Image width={300} height={300} loader={() => pp} src={pp} className="w-10/12 h-10/12 object-fit " alt="Photo de profil utilisateur" />
                                                    </div>
                                                }
                                                <p className="text-sm text-black">{item.formateur.firstName} {item.formateur.name}</p>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                </div>

                <Header selected={2} />

                <Notifs />
                <NavBar />
            </main>
        </>
    );
};

export default IndexBrief;