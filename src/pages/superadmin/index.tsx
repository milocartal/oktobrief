import { InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

import { type Session as SessionAuth } from 'next-auth'

import { NavBar, Promos } from "~/components/barrel";
import Image from "next/image";
import { prisma } from "~/server/db";
import { Brief, Promo, Referentiel, User } from "@prisma/client";
import { BiSearch } from "react-icons/bi";
import { aleatoirePP } from "~/utils/genertor";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
    promos: Promo[],
    referentiels: Referentiel[],
    briefs: Brief[]
    users: User[]
}> = async function (context) {
    const session = await getSession(context)
    const superadmin = session?.superadmin


    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!superadmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const promos = await prisma.promo.findMany({
        orderBy: {
            createAT: 'desc'
        }
    })

    const referentiels = await prisma.referentiel.findMany()
    const briefs = await prisma.brief.findMany()
    const users = await prisma.user.findMany()

    return {
        props: {
            promos: JSON.parse(JSON.stringify(promos)) as Promo[],
            referentiels: JSON.parse(JSON.stringify(referentiels)) as Referentiel[],
            briefs: JSON.parse(JSON.stringify(briefs)) as Brief[],
            users: JSON.parse(JSON.stringify(users)) as User[],
        }
    }
};

const SuperAdmin: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ promos, referentiels, users, briefs }) => {

    const [SearchTerm, setSearchTerm] = useState('');
    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
      };
    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
                <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">

                    <h1 className="text-4xl font-extrabold text-black w-full mb-10">Votre dashboard super admin</h1>

                    <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 gap-5 rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Données sur la plateforme</h2>
                        </span>

                        <div className="flex w-full flex-row items-center justify-center gap-20">
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-6xl mb-2 text-[#2EA3A5]">{users?.length}</h3>
                                <p className="text-2xl mb-5 text-[#0E6073] font-[700]">Apprenant(s)</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-6xl mb-2 text-[#2EA3A5]">{promos?.length}</h3>
                                <p className="text-2xl mb-5 text-[#0E6073] font-[700]">Promo(s) créée(s)</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-6xl mb-2 text-[#2EA3A5]">{briefs?.length}</h3>
                                <p className="text-2xl mb-5 text-[#0E6073] font-[700]">Projet(s) créé(s)</p>
                            </div>
                        </div>
                    </section>

                    <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Les dernières promos créées</h2>
                            <Link className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg" href={"/superadmin/promo"}>
                                Gérer les promos
                            </Link>
                        </span>

                        <div className="grid grid-cols-3 gap-3">
                            {promos && promos.length > 0 && promos.slice(0, 3).map((promo) => {
                                let img = "/logo-gradient.jpg"
                                if (promo.image !== "") {
                                    img = promo.image
                                }
                                let description = promo.description
                                if (description.length > 100) {
                                    description = promo.description.slice(0, 100) + '...'
                                }

                                return (
                                    <Link href={`/superadmin/promo/${promo.id}`} className="flex flex-col max-w-[500px] rounded-lg h-[350px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" key={promo.id}>
                                        <Image width={500} height={500} loader={() => img} src={img} className="w-[100%] h-[200px] bg-center bg-cover object-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                                        <div className="m-5 text-start">
                                            <h3 className="text-lg text-black">{promo.title}</h3>
                                            <div className="text-sm text-black overflow-hidden" dangerouslySetInnerHTML={{ __html: description }} />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 rounded-xl gap-5">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Les référentiels</h2>
                            <span className="flex w-[60%] flex-row items-center justify-end gap-5">
                                <div className="pr-5 rounded-full py-3 bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center self-end mr-2 mb-3">
                                    <BiSearch className="text-2xl text-black ml-4"/>
                                    <input
                                        type='text'
                                        name="searchProject"
                                        className="pr-[1rem] pl-1 w-full bg-transparent"
                                        autoComplete="off"
                                        onChange={handleSearchTerm}
                                    />
                                </div>
                                <Link href={"/superadmin/referentiel/creer"} className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg ">
                                    Créer un référentiel
                                </Link>
                            </span>
                        </span>
                        <div className="flex flex-row flex-wrap justify-center w-full gap-3">
                            {referentiels?.map((refe) => {
                                return (
                                    <Link href={`/superadmin/referentiel/${refe.id}`} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 min-h-[70px] w-[30%] rounded-xl text-center" key={refe.id}>
                                        <p className="text-[14px]">{refe.title}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 rounded-xl gap-5">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Les nouveaux utilisateurs</h2>
                            <span className="flex w-[60%] flex-row items-center justify-end gap-5">
                                <div className="pr-5 rounded-full py-3 bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center self-end mr-2 mb-3">
                                    <BiSearch className="text-2xl text-black ml-4"/>
                                    <input
                                        type='text'
                                        name="searchProject"
                                        className="pr-[1rem] pl-1 w-full bg-transparent"
                                        autoComplete="off"
                                        onChange={handleSearchTerm}
                                    />
                                </div>
                                <Link href={"/superadmin/users"} className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg ">
                                    Consulter les utilisateurs
                                </Link>
                            </span>
                        </span>
                        <div className="w-full grid grid-cols-2 gap-x-10 gap-y-2 content-stretch">
                            {users.filter((user) => {
                                return user.firstName?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.name?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.email?.toLowerCase().includes(SearchTerm.toLowerCase())
                            }).reverse().slice(0,4).map((user) => {
                                let pp = aleatoirePP()
                                if (user.image !== "" && user.image !== null) {
                                    pp = user.image
                                }
                                return (
                                    <Link href={`/superadmin/users/`} className="flex flex-row justify-between items-center w-full mt-5" key={user.id}>
                                        <div className="flex flex-row items-center max-w-[75%]">
                                            <Image width={300} height={300} loader={() => pp} src={pp} className="w-20 h-20 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                                            <div className="">
                                                <p className="text-base text-black font-semibold">{user.firstName} {user.name}</p>
                                                <p className="text-sm text-black">{user.email}</p>
                                            </div>
                                        </div>
                                        <p>{user.superadmin? "Super Admin" : user.formateur ? "Formateur" : "Apprenant"}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                </div>

                <NavBar />
            </main>
        </>
    );
};

export default SuperAdmin;