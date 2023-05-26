import { GetServerSideProps, type NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { BiClipboard } from "react-icons/bi";
import { CgPlayListCheck } from "react-icons/cg"
import { FaInbox, FaOctopusDeploy } from "react-icons/fa"

export const getServerSideProps: GetServerSideProps<{
    
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

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f3] text-black pl-[100px]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Votre Dasboard
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>

          </div>
        </div>

        <div className="fixed top-0 left-0 w-[100px] bg-[#0e6073] h-screen flex flex-col items-center text-white text-sm justify-between py-5">
          
          <div className="flex flex-col gap-8 items-center justify-center">
            <img src="logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enrouler qui forme un O" />
            <Link href={"/briefs"} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><BiClipboard className="text-4xl" />Projet</Link>
            <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><FaInbox className="text-4xl" />Rendu</Link>
            <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><CgPlayListCheck className="text-4xl" />Suivi</Link>
            <Link href={""} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><FaOctopusDeploy className="text-4xl" />Référentiel</Link>
            <Link href={"/superadmin"} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><img src="superhero.svg" className="w-10" />Super Admin</Link>
          </div>

          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? sessionData.user.image ? <img src={sessionData.user.image} className="w-[4rem] h-[4rem] object-cover rounded-full" /> : <p className="mx-10 my-3">{sessionData.user.name}</p> : <p className="mx-3 my-3">Sign In</p>}
      </button>
    </div>
  );
};
