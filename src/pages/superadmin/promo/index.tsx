import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { NavBar, Notifs, Promos } from "~/components/barrel";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { prisma } from "~/server/db";
import { Promo } from "@prisma/client";


export const getServerSideProps: GetServerSideProps<{
    promos: Promo[],
    nbActive: number
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

    const promos = await prisma.promo.findMany()

    const nbActive = await prisma.promo.count({
        where: {
            active: true
        }
    })

    return {
        props: {
            promos: JSON.parse(JSON.stringify(promos)) as Promo[],
            nbActive: nbActive
        }
    }
};

const IndexPromoAdmin: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ promos, nbActive }) => {

    const nb: number = nbActive
    const nbPromo: number = promos.length

    let dataGrA = 0
    let dataGrB = 100
    if (nb === nbPromo) {
        dataGrA = 100
        dataGrB = 0
    }
    else {
        dataGrA = Math.round((nb / nbPromo) * 100)
        dataGrB = 100 - dataGrA
    }

    const data = [
        { name: 'Group A', value: dataGrA, fill: '#2EA3A5' },
        { name: 'Group B', value: dataGrB, fill: "#D9D9D9" },
    ];
    const [open, setOpen] = useState(false)

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
                <div className="flex min-h-screen w-full flex-col items-start justify-start px-10 pt-[40px]">
                    <span className="flex w-[80%] flex-row items-center justify-between mb-5 pl-10">
                        <h1 className="text-4xl font-extrabold text-black">Les promos</h1>
                        <span className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[32%] flex flex-row justify-between items-center">
                            <BiSearch className="text-3xl text-black ml-4" />
                            <input
                                type='text'
                                name="promoDateStart"
                                className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                autoComplete="off"
                            />
                        </span>
                    </span>

                    <div className="w-full flex flex-row justify-between">
                        <div className="flex w-[80%] flex-col items-center justify-start bg-white p-10 mb-5 rounded-xl">

                            <span className="flex w-full flex-row items-center justify-between mb-3">

                                <span className="flex w-[45%] flex-row items-center justify-start">
                                    <button className="text-sm text-black bg-[#EDEDED] rounded-full px-5 py-3 mr-2">Actives</button>
                                    <button className="text-sm text-black bg-[#EDEDED] rounded-full px-5 py-3 mr-2">Inactives</button>
                                </span>

                                <span className="flex w-[60%] flex-row items-center justify-end">

                                    <div className="relative">
                                        <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] text-white rounded-lg" onClick={() => setOpen(!open)}>
                                            <p className="text-base mr-2">Tri par: Date de début</p>
                                            <BiChevronDown className="text-4xl" />
                                        </button>
                                        {open &&
                                            <div className="w-full absolute bg-white rounded-b-lg flex flex-col items-center divide-y divide-[#0E6073]">
                                                <button className="text-sm text-[#0E6073] py-4">Promo 2 2022/2023</button>
                                                <button className="text-sm text-[#0E6073] py-4">Promo 3 2022/2023</button>
                                                <button className="text-sm text-[#0E6073] py-4">Promo 4 2022/2023</button>
                                            </div>
                                        }
                                    </div>

                                    <Link href={`/superadmin/promo/creer`} className="flex flex-row items-center justify-between px-5 py-3 ml-4 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">
                                        Créer une promo
                                    </Link>
                                </span>
                            </span>

                            <div className="grid grid-cols-3 w-full gap-3">
                                {promos && promos.length > 0 && promos.map((promo) => {
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
                                                <div className="text-sm text-black overflow-clip" dangerouslySetInnerHTML={{ __html: description }} />
                                            </div>
                                        </Link>

                                    )
                                })}
                            </div>
                        </div>

                        <aside className="flex w-[19%] flex-col items-center justify-start bg-white h-fit p-5 py-10 mb-5 rounded-xl">
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-6xl mb-2 text-[#2EA3A5]">{promos.length}</h3>
                                <p className="text-xl mb-5 text-[#0E6073] text-center">Promotions créées</p>
                            </div>
                            <div className="flex flex-col items-center justify-center relative">
                                <div className="flex flex-col items-center justify-center absolute">
                                    <h3 className="text-4xl text-[#0E6073]">{data[0]?.value}%</h3>
                                    <p className="text-base mb-1 text-[#0E6073]">Promos actives</p>
                                </div>
                                <ResponsiveContainer width={300} height={200}>
                                    <PieChart width={200} height={200}>
                                        <Pie
                                            data={[{ value: 100 }]} dataKey="value" innerRadius={75} outerRadius={95} fill="#D9D9D9" isAnimationActive={false}
                                        />
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={75}
                                            outerRadius={95}
                                            startAngle={90}
                                            endAngle={450}
                                            cornerRadius={90}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>

                                    </PieChart>
                                </ResponsiveContainer>


                            </div>
                        </aside>
                    </div>
                </div>
                <Notifs />
                <NavBar />
            </main>
        </>
    );
};

export default IndexPromoAdmin;