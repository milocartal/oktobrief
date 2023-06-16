import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { type Session as SessionAuth } from 'next-auth';

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

    if(session.promo){
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

export default function Custom404() {

  const url = "https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif"
  return (
    <>
      <Head>
        <title>OOPS</title>
      </Head>
      <main className="flex flex-col h-screen w-full items-center justify-center gap-10">
        <Image width={400} height={400} loader={() => url} src={url} alt="Les erreurs 404, envie de crever" className="max-w-[50%]" />
        <h1>Et merde, Pas de promo, c&apos;est pas ouf</h1>
      </main>
    </>);
}