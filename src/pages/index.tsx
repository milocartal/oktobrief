import { GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { BiGroup, BiCalendar, BiPencil, BiTrash } from "react-icons/bi";
import NavBar from "./components/navbar";
import Notifs from "./components/notifs";
import Promo from "./components/promo";import { FaInbox, FaOctopusDeploy, FaBell, FaCircle } from "react-icons/fa"
import { useState } from "react";
import { type Session as SessionAuth } from 'next-auth'


export const getServerSideProps: GetServerSideProps<{ session: SessionAuth }> = async function (context) {
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

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
        <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
          <span className="flex w-full flex-row items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-black">Votre dashboard</h1>
            <Promo />
          </span>

          <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Ma promo</h2>
              <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                <p className="text-base">Modifier</p>
              </button>
            </span>

            <div className="flex w-full flex-row items-center">
              <img src="promo.jpeg" className="w-[55%] max-h-[300px] bg-center bg-cover mr-5" alt="Image de la promo sélectionnée" />
              <div className="w-[45%]">
                <h3 className="text-xl text-black mb-2">Promo 1 2022/2023</h3>
                <p className="text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vehicula erat dui, nec facilisis dolor aliquet a. Nulla pellentesque libero ac ante fermentum.</p>
                <span className="flex w-full flex-row items-center justify-between">
                  <span className="flex w-full flex-row items-center">
                    <BiGroup className="text-4xl text-[#0E6073] mr-1"/> 
                    <p>12 apprenants</p>
                  </span>
                  <span className="flex w-full flex-row items-center">
                    <BiCalendar className="text-4xl text-[#0E6073] mr-1"/>
                    <p>Du 04/01/2022 au 10/09/2023</p>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les projets de ma promo</h2>
              <span className="flex w-[45%] flex-row items-center justify-end">
                <input
                    type='text'
                    name="leconTitle"
                    className="px-[1rem] py-3 rounded-full bg-white shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-[50%] mr-2"
                    autoComplete="off"
                  />
                <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                  <p className="text-base">Créer un projet</p>
                </button>
              </span>
            </span>
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <img src="promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée"/>
                <div className="m-5">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </div>

              <div className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <img src="promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée"/>
                <div className="m-5">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </div>

              <div className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <img src="promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée"/>
                <div className="m-5">
                  <h3 className="text-lg text-black">Découvrir React Native</h3>
                  <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                  <span className="flex flex-row justify-end items-center w-full mt-5">
                    <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
                    <p className="text-sm text-black">Lorem ipsum</p>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les ressources de la promo</h2>
              <span className="flex w-[60%] flex-row items-center justify-end">
                <input
                    type='text'
                    name="leconTitle"
                    placeholder="Rechercher par nom ou par tag"
                    className="px-[1rem] py-3 rounded-full bg-white shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-[55%] mr-2"
                    autoComplete="off"
                  />
                <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                  <p className="text-base text-center">Ajouter une ressource</p>
                </button>
              </span>
            </span>

            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
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
                <img src="promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée"/>
              </div>

              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
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
                <img src="promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée"/>
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