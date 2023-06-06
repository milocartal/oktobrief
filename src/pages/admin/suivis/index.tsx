import { type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { type Session as SessionAuth } from 'next-auth'

import { NavBar } from "~/components/barrel";
import { FaArrowDown, FaInbox } from "react-icons/fa";
import { BiCheck, BiX } from "react-icons/bi";
import { useState } from "react";
import Image from "next/image";


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

const Rendus: NextPage = () => {
    const [isToggled, setIsToggled] = useState(false);
    const [selected, setSelected] = useState(false);

    const DATA = [
        {
            "id": 1,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 2,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 3,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 4,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 5,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 6,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 7,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 8,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        },
        {
            "id": 9,
            "nom": "Projet 2",
            "apprenant": "Lorem Ipsum"
        }
    ]

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen flex-row items-center justify-between bg-[#F3F3F3] pl-[130px] pb-3 gap-5">
                <section className="bg-white h-full w-[28%] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center overflow-auto p-2">
                    <div>
                        <label className="relative inline-block w-[280px] cursor-pointer rounded-full bg-[#ECECEC] h-[40px] z-20 top-5" id="switchlabelm">
                                <div className="absolute flex flex-row items-center justify-between w-full h-full pr-5 pl-5 z-20">
                                    {isToggled ?
                                    <><p className="text-sm mr-2">Tous les rendus</p><p className="text-sm mr-2 text-white">À corriger</p></>
                                    :
                                    <><p className="text-sm mr-2 text-white">Tous les rendus</p><p className="text-sm mr-2">À corriger</p></>
                                    }
                                    
                                </div>
                                <input type="checkbox" className="hidden transform-[translateX(50px)]" checked={isToggled} onChange={() => setIsToggled(!isToggled)} id="switchinputm"/>

                                <span className="absolute top-0 left-0 bottom-0 right-0 before:absolute before:content-[''] before:h-[37px] before:w-[145px] before:bg-[#2EA3A5] before:rounded-full before:top-[2px] before:left-[2px] before:transition-[transform] before:duration-[0.4s] before:ease before: z-10" id="switchspanm">
                            </span>
                        </label>
                    </div>
                    <div className="mt-10 px-3 flex flex-col items-start self-start">
                        {DATA.map((item) => {
                                return (
                                    <span key={item.id} className="flex flex-row my-2">
                                        <div className="flex flex-row items-center justify-center bg-[#F3F3F3] rounded-full h-[60px] w-[60px] relative mr-4">
                                            <FaArrowDown className="absolute text-2xl top-2 text-black"/>
                                            <FaInbox className="text-3xl text-[#2EA3A5]"/>
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <p>{item.nom}</p>
                                            <p>{item.apprenant}</p>
                                        </div>
                                    </span>
                                )
                        })}
                    </div>
                </section>

                <section className="relative bg-white h-full w-[50%] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] pr-2 flex flex-col items-start">
                    <div className="flex flex-row items-center absolute top-5 left-5">
                        <Image width={200} height={200} src="/userPFP.png" className="w-16 h-16 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
                        <p className="text-lg mb-3">Lorem Ipsum, projet 2</p>
                    </div>
                    <div className="mt-24 pl-5 pr-3 overflow-auto mb-20 flex flex-col flex-col-reverse">
                        
                        <div className="my-1">
                            <div className="bg-[#F0F0F0] py-3 px-5 max-w-[70%] rounded-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales bibendum. Praesent porta pellentesque arcu. In eu diam venenatis, sagittis ante vitae, tempor nunc. Mauris eleifend purus nulla, in ultrices turpis ullamcorper in. In venenatis dolor condimentum lobortis tempor.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 ml-5">22/10/21, 12:54</p>
                        </div>

                        <div className="w-full flex flex-col my-1">
                            <div className="bg-[#2EA3A5]/30 py-3 px-5 max-w-[70%] rounded-lg self-end">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 mr-5 self-end">22/10/21, 14:36</p>
                        </div>

                        <div className="my-1">
                            <div className="bg-[#F0F0F0] py-3 px-5 max-w-[70%] rounded-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 ml-5">22/10/21, 14:36</p>
                        </div>
                        <div className="my-1">
                            <div className="bg-[#F0F0F0] py-3 px-5 max-w-[70%] rounded-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales bibendum. Praesent porta pellentesque arcu. In eu diam venenatis, sagittis ante vitae, tempor nunc. Mauris eleifend purus nulla, in ultrices turpis ullamcorper in. In venenatis dolor condimentum lobortis tempor.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 ml-5">22/10/21, 12:54</p>
                        </div>

                        <div className="w-full flex flex-col my-1">
                            <div className="bg-[#2EA3A5]/30 py-3 px-5 max-w-[70%] rounded-lg self-end">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 mr-5 self-end">22/10/21, 14:36</p>
                        </div>

                        <div className="my-1">
                            <div className="bg-[#F0F0F0] py-3 px-5 max-w-[70%] rounded-lg">
                                <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales.</p>
                            </div>
                            <p className="text-sm text-[#888888] mt-2 ml-5">22/10/21, 14:36</p>
                        </div>
                    </div>
                    <input
                        type='text'
                        placeholder="Écrivez votre message"
                        name="searchProject"
                        className="pr-[1rem] pl-5 py-2 w-[calc(100%-40px)] h-14 bg-[#F0F0F0] absolute bottom-5 self-center rounded-lg"
                        autoComplete="off"
                    />
                </section>

                <section className="relative bg-white h-full w-[30%] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-start p-3 pt-10">
                    <p className="text-lg ml-2 mb-3">Compétences de ce projet</p>
                    <div className="bg-[#F0F0F0] py-3 px-5 w-full rounded-lg">
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo sollicitudin est. Nulla a est id quam sodales bibendum.</p>
                    </div>
                    <p className="text-base ml-2 mb-3 mt-5">Compétence 1</p>
                    <span className="w-full flex flex-row justify-around">
                        {selected ?
                            <>
                                <button className="flex flex-row items-center justify-between bg-[#00B01C]/20 px-2 py-1 rounded-lg min-w-[40%]" onClick={() => setSelected(true)}>
                                    <p className="text-sm text-[#00B01C]">Valider</p>
                                    <BiCheck className="text-2xl text-[#00B01C]" />
                                </button>
                                <button className="flex flex-row items-center justify-between bg-[#F0F0F0] px-2 py-1 rounded-lg min-w-[40%]" onClick={() => setSelected(false)}>
                                    <p className="text-sm">Invalider</p>
                                    <BiX className="text-2xl text-[#CD0202]" />
                                </button>
                            </>
                        :
                            <>
                                <button className="flex flex-row items-center justify-between bg-[#F0F0F0] px-2 py-1 rounded-lg min-w-[40%]" onClick={() => setSelected(true)}>
                                    <p className="text-sm">Valider</p>
                                    <BiCheck className="text-2xl text-[#00B01C]" />
                                </button>
                                <button className="flex flex-row items-center justify-between bg-[#CD0202]/20 px-2 py-1 rounded-lg min-w-[40%]" onClick={() => setSelected(false)}>
                                    <p className="text-sm text-[#CD0202]">Invalider</p>
                                    <BiX className="text-2xl text-[#CD0202]" />
                                </button>
                            </>
                        }
                    </span>
                    <button className="absolute self-center bottom-5 px-8 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">Enregistrer</button>
                </section>

                <NavBar />
            </main>
        </>
    );
};

export default Rendus;