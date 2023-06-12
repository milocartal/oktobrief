import { type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";

import { type Session as SessionAuth } from 'next-auth'

import { NavBar } from "~/components/barrel";
import Router from "next/router";

export const getServerSideProps: GetServerSideProps<{
    session: SessionAuth
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

    return {
        props: { session }
    }
};

const CreerRef: NextPage = () => {
    const createRef = api.referentiel.create.useMutation()

    async function handleTitle(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            refTitle: { value: string };
        };
        const title = target.refTitle.value
        const lec = await createRef.mutateAsync({ title: title })
        await Router.push(`/superadmin/referentiel/${lec.id}/modifier`)

    }

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">

                <h1 className="text-4xl font-extrabold text-black w-full">Créer un référentiel</h1>

                <form onSubmit={(e)=>void handleTitle(e)} className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl" method="POST">
                    <input
                        type='text'
                        name="refTitle"
                        id="refTitle"
                        className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_3px_6px_12px_4px_rgba(0,0,0,0.25)] w-full"
                        autoComplete="off"
                        placeholder="Titre du référentiel"
                        required
                    />

                    <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-lg" type="submit">
                        Ajouter des compétences
                    </button>
                </form>



                <NavBar />
            </main>
        </>
    );
};

export default CreerRef;