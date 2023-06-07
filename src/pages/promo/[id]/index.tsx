import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { BiGroup, BiCalendar, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import { NavBar, Notifs, Promos } from "~/components/barrel";
import Link from "next/link";
import { prisma } from "~/server/db";
import { type Brief, type Prisma, type Promo } from "@prisma/client";

import Image from "next/image";

export const getServerSideProps: GetServerSideProps<{
  briefs: Brief[],
  promos: Promo[]
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


  const promos = await prisma.promo.findMany({
    where:{
      apprenants:{
        some:{
          id: session.user.id
        }
      }
    }
  })

  const briefs = await prisma.brief.findMany({
    where: {
      assignations: {
        some: {
          idUser: session.user.id
        }
      }
    }
  })

  return {
    props: {
      briefs: JSON.parse(JSON.stringify(briefs)) as Brief[],
      promos: JSON.parse(JSON.stringify(promos)) as Promo[]
    }
  }
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ briefs, promos }) => {
  const { data: sessionData } = useSession()

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>

      <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">

        <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
          <span className="flex w-full flex-row items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-black">Votre dashboard</h1>
            <Promos promos={promos} />
          </span>

          <section className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Ma promo</h2>
              <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                Modifier
              </button>
            </span>

            <div className="flex w-full flex-row items-center">
              {sessionData && sessionData.promo && sessionData.promo.image !== "" && <Image width={900} height={900} loader={()=>sessionData.promo.image} src={sessionData.promo.image} className="w-[55%] max-h-[300px] bg-center bg-cover mr-5 object-cover" alt="Image de la promo sélectionnée" />}
              <div className="w-[45%]">
                <h3 className="text-xl text-black mb-2">{sessionData?.promo.title}</h3>
                {sessionData && sessionData.promo && sessionData.promo.description && <div className="text-sm mb-5" dangerouslySetInnerHTML={{__html:sessionData.promo.description}}/>}
                <span className="flex w-full flex-row items-center justify-between">
                  <span className="flex w-full flex-row items-center">
                    <BiGroup className="text-4xl text-[#0E6073] mr-1" />
                    <p>{sessionData && sessionData.promo && sessionData?.promo.apprenants ? sessionData.promo.apprenants.length: "0"} apprenants</p>
                  </span>
                  <span className="flex w-full flex-row items-center">
                    <BiCalendar className="text-4xl text-[#0E6073] mr-1" />
                    <p>Du 04/01/2022 au 10/09/2023</p>
                  </span>
                </span>
              </div>
            </div>
          </section>

          <section className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">

            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les projets de ma promo</h2>
              <span className="flex flex-row items-center justify-end w-[50%]">
                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center mr-2">
                  <BiSearch className="text-3xl text-black ml-4" />
                  <input
                    type='text'
                    name="searchProject"
                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                    autoComplete="off"
                  />
                </div>
                <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">
                  Créer un projet
                </button>
              </span>
            </span>
            <div className="flex flex-row justify-between w-full">
              <Link className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" href={""}>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                <div className="m-5 text-start">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </Link>

              <Link className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" href={""}>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                <div className="m-5 text-start">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </Link>

              <Link className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" href={""}>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                <div className="m-5 text-start">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </Link>
            </div>
          </section>

          <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les ressources de la promo</h2>
              <span className="flex w-[60%] flex-row items-center justify-end">
                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center mr-2">
                  <BiSearch className="text-3xl text-black ml-4" />
                  <input
                    type='text'
                    placeholder="Rechercher"
                    name="searchResources"
                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                    autoComplete="off"
                  />
                </div>
                <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base text-center">
                  Ajouter une ressource
                </button>
              </span>
            </span>

            <div className="flex flex-col items-center w-full gap-5">
              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                      <p className="text-sm text-black">Lorem ipsum</p>
                    </span>
                  </div>
                  <div className="w-[30%] px-2">
                    <span className="flex flex-row justify-center">
                      <BiPencil className="text-3xl text-[#2EA3A5] mx-2" />
                      <BiTrash className="text-3xl text-[#A10000] mx-2" />
                    </span>
                    <span className="flex flex-row justify-start mt-5 w-full flex-wrap">
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">Drupal</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">JavaScript</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                    </span>

                  </div>
                </div>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée" />
              </div>

              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                      <p className="text-sm text-black">Lorem ipsum</p>
                    </span>
                  </div>
                  <div className="w-[30%] px-2">
                    <span className="flex flex-row justify-center">
                      <BiPencil className="text-3xl text-[#2EA3A5] mx-2" />
                      <BiTrash className="text-3xl text-[#A10000] mx-2" />
                    </span>
                    <span className="flex flex-row justify-start mt-5 w-full flex-wrap">
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">Drupal</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">JavaScript</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                    </span>

                  </div>
                </div>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée" />
              </div>
            </div>
          </div>
        </div>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default Home;