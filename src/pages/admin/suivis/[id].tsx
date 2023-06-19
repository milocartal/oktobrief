import { type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { BiSearch, BiChevronDown, BiChevronUp, BiCheck, BiX } from "react-icons/bi";

import { NavBar, Notifs, Promos } from "~/components/barrel";

import { type Session as SessionAuth } from 'next-auth'
import { useState } from "react";
import Image from "next/image";


export const getServerSideProps: GetServerSideProps<{ session: SessionAuth }> = async function (context) {
    const session = await getSession(context)
    const superadmin = session?.superadmin
    const formateur = session?.formateur

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!superadmin || !formateur) {
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

const Suivi: NextPage = () => {

    const [selectedUser, setSelectedUser] = useState(1)
    const [selected, setSelected] = useState(1)

    const STUDENTS = [
        {
            "id": 1,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        },
        {
            "id": 2,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        },
        {
            "id": 3,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        },
        {
            "id": 4,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        },
        {
            "id": 5,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        },
        {
            "id": 6,
            "nom": "Lorem Ipsum",
            "email": "loremipsum@mail.com"
        }
    ]

    const COMPETENCES = [
        {
            "id": 1,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "4",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": false,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                }
            ]
        },
        {
            "id": 2,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": false,
                    "date": "12/12/2023"
                }
            ]
        },
        {
            "id": 3,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": false,
                    "date": "12/12/2023"
                }
            ]
        },
        {
            "id": 4,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": false,
                    "date": "12/12/2023"
                }
            ]
        },
        {
            "id": 5,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "1",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                }
            ]
        },
        {
            "id": 6,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections": [
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": true,
                    "date": "12/12/2023"
                },
                {
                    "nom": "Évaluation du Projet Lorem 12",
                    "validation": false,
                    "date": "12/12/2023"
                }
            ]
        }
    ]

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
                        <h1 className="text-4xl font-extrabold text-black">Suivi des apprenants</h1>
                        <Promos />
                    </span>
                    <div className="w-full flex flex-row">
                        <div className="w-[25%] bg-white h-fit flex flex-col items-start p-5 py-8 rounded-lg">
                            <h1 className="text-2xl font-extrabold text-black">Apprenants</h1>
                            <div className="pr-[1rem] mt-5 rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full flex flex-row justify-between items-center">
                                <BiSearch className="text-3xl text-black ml-4" />
                                <input
                                    type='text'
                                    name="promoDateStart"
                                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="self-center flex flex-col items-center w-full">
                                {STUDENTS.map((item) => {
                                    return (
                                        <>
                                            {selectedUser === item.id ? <button className="flex flex-row justify-center items-center w-[90%] mt-2 bg-[#2EA3A5] rounded-lg py-2" key={item.id} onClick={() => { setSelectedUser(item.id) }}>
                                                <div className="flex flex-row items-center">
                                                    <Image width={200} height={200} src="/userPFP.png" className="w-14 h-14 rounded-full object-cover mr-5" alt="Photo de profil utilisateur" />
                                                    <p className="text-base text-white font-semibold">{item.nom}</p>
                                                </div>
                                            </button>
                                                :
                                                <button className="flex flex-row justify-center items-center w-[90%] mt-2 py-2" key={item.id} onClick={() => { setSelectedUser(item.id) }}>
                                                    <div className="flex flex-row items-center">
                                                        <Image width={200} height={200} src="/userPFP.png" className="w-14 h-14 rounded-full object-cover mr-5" alt="Photo de profil utilisateur" />
                                                        <p className="text-base text-black font-semibold">{item.nom}</p>
                                                    </div>
                                                </button>}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="w-[75%] flex flex-col items-start p-5 py-8">
                            <h2 className="text-2xl mb-3">Développeur web et web mobile</h2>
                            {COMPETENCES.map((item) => {
                                return (
                                    <>
                                        {selected === item.id ?
                                            <button className="w-full bg-white flex flex-col rounded-lg my-2" onClick={() => { setSelected(item.id) }} key={item.id}>
                                                <div className="w-full flex flex-row justify-between items-center p-5">
                                                    <p>C{item.id}</p>
                                                    <p>{item.nom}</p>
                                                    <div className="bg-[#2EA3A5] rounded-lg py-1 px-4">
                                                        <p className="text-white text-sm">{item.nbCorr} corrections</p>
                                                    </div>
                                                    <BiChevronUp className="text-4xl" />
                                                </div>
                                                <div className="flex flex-col w-full p-2">
                                                    {item.corrections.map((comp) => {
                                                        return (
                                                            <>
                                                                <div className="w-full bg-white flex flex-row justify-between items-center p-5 my-1 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" key={item.id}>
                                                                    <p>{comp.nom}</p>
                                                                    <div className="flex flex-row justify-between">
                                                                        {comp.validation ?
                                                                            <div className="flex flex-row justify-between items-center mr-5 bg-[#00B01C]/20 rounded-lg py-1 px-4">
                                                                                <BiCheck className="text-2xl text-[#00B01C] mr-2" />
                                                                                <p className="text-[#00B01C]">Niveau 2</p>
                                                                            </div>
                                                                            :
                                                                            <div className="flex flex-row justify-between items-center mr-5 bg-[#CD0202]/20 rounded-lg py-1 px-4">
                                                                                <BiX className="text-2xl text-[#CD0202] mr-2" />
                                                                                <p className="text-[#CD0202]">Niveau 2</p>
                                                                            </div>
                                                                        }
                                                                        <p>{comp.date}</p>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    })}
                                                </div>

                                            </button>
                                            :
                                            <button className="w-full bg-white flex flex-row justify-between items-center p-5 rounded-lg my-2" onClick={() => { setSelected(item.id) }}>
                                                <p>C{item.id}</p>
                                                <p>{item.nom}</p>
                                                <div className="bg-[#2EA3A5] rounded-lg py-1 px-4">
                                                    <p className="text-white text-sm">{item.nbCorr} corrections</p>
                                                </div>
                                                <BiChevronDown className="text-4xl" />
                                            </button>
                                        }
                                    </>
                                )
                            })}

                        </div>

                    </div>
                </div>
                <Notifs />
                <NavBar />
            </main>
        </>
    );
}

export default Suivi;