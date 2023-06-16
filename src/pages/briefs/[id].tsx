import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { NavBar, Notifs } from "~/components/barrel";
import { BiLeftArrowAlt, BiLink, BiCheck, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import { IoChevronUpCircleSharp, IoChevronDownCircleSharp } from "react-icons/io5";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { prisma } from "~/server/db";
import type { BriefWithAll } from "~/utils/type";


export const getServerSideProps: GetServerSideProps<{
    brief: BriefWithAll,
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

    const brief = await prisma.brief.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            ressources: {
                include: {
                    tags: true
                }
            },
            referentiel: true,
            tags: true,
            formateur: true,
            Niveaux: {
                include: {
                    competence: true
                }
            }
        }
    })

    if (!brief) {
        return {
            redirect: {
                destination: '/briefs',
                permanent: false,
            },
        }
    }

    return {
        props: {
            brief: JSON.parse(JSON.stringify(brief)) as BriefWithAll,
        }
    }
};

const Brief: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ brief }) => {
    const [open, setOpen] = useState(true)

    let briefIlu = "/promo.jpeg";
    if (brief.img) {
        briefIlu = brief.img
    }

    return (
        <>
            <Head>
                <title>{brief.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] px-[50px] gap-5 pb-10">
                <div className="w-full h-[400px] absolute z-0 pl-[100px] flex justify-center">
                    <Image width={1000} height={1000} loader={() => briefIlu} src={briefIlu} className="h-full w-full bg-center bg-cover object-cover" alt="Image de la promo sélectionnée" />
                </div>

                <Link href={"/briefs"} className="px-5 py-2 bg-[#fff]/40 text-white rounded-lg text-base self-start z-10 absolute top-[50px] flex flex-row items-center justify-between w-32 ml-[100px]"><BiLeftArrowAlt className="text-3xl" /> Retour</Link>

                <div className="flex w-[80%] flex-col items-center justify-start pt-[200px] relative ml-[100px]">
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">{brief.title}</h1>
                            <span className="flex flex-row justify-around self-end items-center w-24">
                                <Link href={`/admin/briefs/${brief.id}`}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </Link>
                                <button>
                                    <BiTrash className="text-3xl text-[#A10000]" />
                                </button>
                            </span>
                        </span>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.desc }} />

                        <div className="flex flex-row justify-between w-full items-center mt-10 mb-5">
                            <span>
                                <h2 className="text-2xl text-black">Référentiel :</h2>
                                <div className="text-lg text-black" dangerouslySetInnerHTML={{ __html: brief.referentiel.title }} />
                            </span>
                            {open ? <button onClick={() => setOpen(!open)}><IoChevronUpCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button> : <button onClick={() => setOpen(!open)}><IoChevronDownCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button>}
                        </div>
                        {open &&
                            <div className="flex flex-row justify-between items-center w-full mb-5">
                                {brief.Niveaux.map((item) => {
                                    let index = 0
                                    switch (item.title) {
                                        case 'Niveau 1':
                                            index = 1
                                            break;
                                        case 'Niveau 2':
                                            index = 2
                                            break;
                                        case 'Niveau 3':
                                            index = 3
                                            break;
                                        default:
                                            break;
                                    }
                                    return (
                                        <div className="max-w-[33%] border-2 rounded-lg" key={item.id}>
                                            <p className="text-sm text-[#0E6073] m-3">{item.competence.title}</p>
                                            <div className="flex flex-row justify-between items-center w-full rounded-lg">
                                                <span className={`flex flex-row justify-between items-center p-2 rounded-l-lg ${index >= 1 ? "bg-[#0E6073] text-white":""}`}>
                                                    <p className="text-sm">Niveau 1</p>
                                                    {index >= 1 && <BiCheck className="text-white text-xl ml-1" />}
                                                </span>
                                                <span className={`flex flex-row justify-between items-center p-2 ${index >= 2 ? "bg-[#0E6073] text-white":""}`}>
                                                    <p className="text-sm">Niveau 2</p>
                                                    {index >= 2 && <BiCheck className="text-white text-xl ml-1" />}
                                                </span>
                                                <span className={`flex flex-row justify-between items-center p-2 rounded-r-lg ${index >= 3 ? "bg-[#0E6073] text-white":""}`}>
                                                    <p className="text-sm">Niveau 3</p>
                                                    {index >= 3 && <BiCheck className="text-white text-xl ml-1" />}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        }

                        <h2 className="text-2xl text-black mt-5">Contexte du projet</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.contexte }} />

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">

                        <h1 className="text-4xl font-semibold text-black">Modalités</h1>

                        <h2 className="text-2xl text-black mt-10">Modalités pédagogiques</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.modal_peda }} />

                        <h2 className="text-2xl text-black mt-10">Modalités d&apos;évaluation</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.modal_eval }} />


                        <h2 className="text-2xl text-black mt-10">Livrables</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.livrable }} />

                        {brief.perf !== "" &&
                            <>
                                <h2 className="text-2xl text-black mt-10">Critères de performance</h2>
                                <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.perf }} />
                            </>}

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">Ressources du projet</h1>
                            <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[30%] min-w-[200px] max-w-[400px] flex flex-row justify-between items-center mr-2">
                                <BiSearch className="text-3xl text-black ml-4" />
                                <input
                                    type='text'
                                    name="searchProject"
                                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                    autoComplete="off"
                                />
                            </div>

                        </span>
                        <div className="flex flex-col w-full gap-3">
                            {brief.ressources && brief.ressources.length > 0 && brief.ressources.map((item) => {
                                return (
                                    <div className="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-row justify-between items-center w-full pl-5 h-[230px]" key={item.id}>
                                        <div className="w-[50%] flex flex-col items-start my-5">
                                            <h2 className="text-2xl text-black">{item.title}</h2>
                                            <Link href={item.link} className="text-sm text-start text-[#0e6073]">{item.link}</Link>
                                        </div>
                                        <div className="w-[25%] h-full flex flex-col items-center justify-start my-5 py-5">
                                            <span className="flex flex-row justify-around self-end items-center w-24 mb-5">
                                                <Link href={`/admin/ressources/${item.id}`}>
                                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                                </Link>
                                                <button>
                                                    <BiTrash className="text-3xl text-[#A10000]"/>
                                                </button>
                                            </span>
                                            <div className=" w-full grid grid-cols-2 gap-2 content-stretch">
                                                {item.tags && item.tags.map((tag) => {
                                                    return (
                                                        <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full" key={tag.id}>
                                                            <p className="text-sm">{tag.name}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <Image width={1000} height={1500} loader={() => item.img} src={item.img} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la ressource" />
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                <Notifs />
                <NavBar />
            </main>
        </>
    );
};

export default Brief;