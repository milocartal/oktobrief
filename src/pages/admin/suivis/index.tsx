import { GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { BiGroup, BiCalendar, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import NavBar from "./../../components/navbar";
import Notifs from "./../../components/notifs";
import Promo from "./../../components/promo";
import { type Session as SessionAuth } from 'next-auth'
import Link from "next/link";


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

const Suivi: NextPage = () => {

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
            "corrections" : [
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
            "corrections" : [
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
            "id": 3,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections" : [
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
            "id": 4,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections" : [
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
            "id": 5,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "1",
            "corrections" : [
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
            "id": 6,
            "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "nbCorr": "3",
            "corrections" : [
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
                    <Promo />
                </span>
                <div className="w-full flex flex-row ">
                    <div className="w-[30%] h-screen bg-white flex flex-col items-start p-5 py-8">
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
                        <div className="self-center">
                            {STUDENTS.map((item) => {
                                return (
                                    <button className="flex flex-row justify-between items-center w-full mt-5" key={item.id}>
                                        <div className="flex flex-row items-center">
                                            <img src="/userPFP.png" className="w-14 h-14 rounded-full object-cover mr-5" alt="Photo de profil utilisateur"/>
                                            <p className="text-base text-black font-semibold">{item.nom}</p>                              
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="w-[70%] h-screen">

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