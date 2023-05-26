import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>ERROR 404</title>
      </Head>
      <main className="flex flex-col h-screen w-full items-center justify-center gap-10">
        <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Les erreurs 404, envie de crever" className="max-w-[50%]" />
        <h1>Et merde, une 404, j'en ai marre</h1>
      </main>
    </>);
}