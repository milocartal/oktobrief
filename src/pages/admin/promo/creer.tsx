import { GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { type Session as SessionAuth } from 'next-auth'

import NavBar from "~/pages/components/navbar";


export const getServerSideProps: GetServerSideProps<{
    session: SessionAuth
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

    return {
        props: { session }
    }
};

const creerPromo: NextPage = () => {

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">

                <h1 className="text-4xl font-extrabold text-black w-full">Créer un référentiel</h1>

                <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl">
                    <span className="flex w-full flex-row items-center justify-between mb-3">
                        <h2 className="text-2xl text-black">Données sur la plateforme</h2>
                    </span>
                </section>



                <NavBar />
            </main>
        </>
    );
};

export default creerPromo;