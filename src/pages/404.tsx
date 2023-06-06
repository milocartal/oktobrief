import Head from "next/head";
import Image from "next/image";

export default function Custom404() {

  const url = "https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif"
  return (
    <>
      <Head>
        <title>ERROR 404</title>
      </Head>
      <main className="flex flex-col h-screen w-full items-center justify-center gap-10">
        <Image width={400} height={400} loader={() => url} src={url} alt="Les erreurs 404, envie de crever" className="max-w-[50%]" />
        <h1>Et merde, une 404, j&apos;en ai marre</h1>
      </main>
    </>);
}