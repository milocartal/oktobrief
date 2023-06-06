import { useSession } from "next-auth/react";
import { type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { IoChevronUpCircleSharp, IoChevronDownCircleSharp } from "react-icons/io5";
import { NavBar } from "~/components/barrel";
import { type Session as SessionAuth } from 'next-auth'
import { useState } from "react";
import { BiShowAlt, BiHide, BiGroup, BiCalendar } from "react-icons/bi";
import Image from "next/image";


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

const ProfileScreen: NextPage = () => {
    const [shown, setShown] = useState(false)

    const { data: sessionData } = useSession();
    const [open, setOpen] = useState(false)
    const userPFP = sessionData ? sessionData.user.image : undefined

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
                        <h1 className="text-4xl font-extrabold text-black">Mon profil</h1>
                    </span>

                    <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5 relative">
                        <h2 className="text-2xl text-black self-start mb-5">Mon compte</h2>
                        <div className="flex flex-row items-center justify-between w-[80%] self-start">
                            {sessionData && sessionData.user && sessionData.user.image && userPFP && <Image width={200} height={200} loader={() => userPFP} src={userPFP} className="w-40 h-40 rounded-full object-cover" alt="Photo de profil utilisateur" />}
                            <div>
                                <h2 className="text-2xl text-black self-start">{sessionData?.user.name}</h2>
                                {sessionData?.formateur ? <p className="text-lg text-black self-start">Formateur.rice</p> : <p className="text-lg text-black self-start">Apprenant.e</p>}
                            </div>
                            <div>
                                <h2 className="text-2xl text-black self-start">Contact</h2>
                                <p className="text-lg text-black self-start">{sessionData?.user.email}</p>
                            </div>
                        </div>
                        {open ? <button onClick={() => setOpen(!open)}><IoChevronUpCircleSharp className="h-[60px] w-[60px] text-[#0E6073] absolute right-8 top-52" /></button> : <button onClick={() => setOpen(!open)}><IoChevronDownCircleSharp className="h-[60px] w-[60px] text-[#0E6073] absolute right-8 top-52" /></button>}
                        {open && <div className="w-full mt-10 flex flex-row justify-around px-12">
                            {sessionData && sessionData.user.name && sessionData.user.email && <div className="w-[30%]">
                                <p className="mt-2">Prénom</p>
                                <input
                                    type='text'
                                    name="userName"
                                    placeholder={sessionData?.user.name}
                                    className="px-[1rem] py-3 w-full bg-transparent rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                    autoComplete="off"
                                />
                                <p className="mt-2">Nom</p>
                                <input
                                    type='text'
                                    name="userLastName"
                                    placeholder={sessionData?.user.name}
                                    className="px-[1rem] py-3 w-full bg-transparent rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                    autoComplete="off"
                                />
                                <p className="mt-2">Email</p>
                                {sessionData.user.email ? <input
                                    type='text'
                                    name="userEmail"
                                    placeholder={sessionData?.user.email}
                                    className="px-[1rem] py-3 w-full bg-transparent rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                    autoComplete="off"
                                /> :
                                    <input
                                        type='text'
                                        name="userEmail"
                                        placeholder="votre mail"
                                        className="px-[1rem] py-3 w-full bg-transparent rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                        autoComplete="off"
                                    />}
                            </div>}
                            <div className="w-[60%] flex flex-col items-end justify-between">
                                <div className="w-full flex flex-row items-center justify-end">
                                    {sessionData && sessionData.user && sessionData.user.image && userPFP && <Image width={200} height={200} loader={() => userPFP} src={userPFP} className="w-40 h-40 rounded-full object-cover mr-5" alt="Photo de profil utilisateur" />}
                                    <div>
                                        <p>Mot de passe actuel</p>
                                        <div className="rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] h-12 w-full flex flex-row justify-between items-center">
                                            <input
                                                type={shown ? "text" : "password"}
                                                name="currentPassword"
                                                className="px-[1rem] w-full bg-transparent h-full"
                                                autoComplete="off"
                                            />
                                            <button className="bg-[#0E6073] h-full w-20 flex flex-row justify-center items-center rounded-lg" onClick={() => setShown(!shown)}>
                                                {shown ? <BiHide className="text-3xl text-white" /> : <BiShowAlt className="text-3xl text-white" />}
                                            </button>
                                        </div>
                                        <p className="mt-2">Nouveau mot de passe</p>
                                        <div className="rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] h-12 w-full flex flex-row justify-between items-center">
                                            <input
                                                type={shown ? "text" : "password"}
                                                name="newPassword"
                                                className="px-[1rem] w-full bg-transparent h-full"
                                                autoComplete="off"
                                            />
                                            <button className="bg-[#0E6073] h-full w-20 flex flex-row justify-center items-center rounded-lg" onClick={() => setShown(!shown)}>
                                                {shown ? <BiHide className="text-3xl text-white" /> : <BiShowAlt className="text-3xl text-white" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <span>
                                    <button className="px-5 py-3 text-[#A10000] text-base">Annuler</button>
                                    <button className="px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">Enregistrer</button>
                                </span>
                            </div>
                        </div>
                        }
                    </div>
                    <span className="flex w-full flex-row items-center justify-between mb-10 mt-10">
                        <h1 className="text-4xl font-extrabold text-black">Mes promos</h1>
                    </span>
                    <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
                        <div className="flex w-full flex-row items-center">
                            <Image width={400} height={400} src="/promo.jpeg" className="w-[55%] max-h-[300px] bg-center bg-cover mr-5" alt="Image de la promo sélectionnée" />
                            <div className="w-[45%]">
                                <h3 className="text-xl text-black mb-2">Promo 1 2022/2023</h3>
                                <p className="text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vehicula erat dui, nec facilisis dolor aliquet a. Nulla pellentesque libero ac ante fermentum.</p>
                                <span className="flex w-full flex-row items-center justify-between">
                                    <span className="flex w-full flex-row items-center">
                                        <BiGroup className="text-4xl text-[#0E6073] mr-1" />
                                        <p>12 apprenants</p>
                                    </span>
                                    <span className="flex w-full flex-row items-center">
                                        <BiCalendar className="text-4xl text-[#0E6073] mr-1" />
                                        <p>Du 04/01/2022 au 10/09/2023</p>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
                        <div className="flex w-full flex-row items-center">
                            <Image width={400} height={400} src="/promo.jpeg" className="w-[55%] max-h-[300px] bg-center bg-cover mr-5" alt="Image de la promo sélectionnée" />
                            <div className="w-[45%]">
                                <h3 className="text-xl text-black mb-2">Promo 1 2022/2023</h3>
                                <p className="text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vehicula erat dui, nec facilisis dolor aliquet a. Nulla pellentesque libero ac ante fermentum.</p>
                                <span className="flex w-full flex-row items-center justify-between">
                                    <span className="flex w-full flex-row items-center">
                                        <BiGroup className="text-4xl text-[#0E6073] mr-1" />
                                        <p>12 apprenants</p>
                                    </span>
                                    <span className="flex w-full flex-row items-center">
                                        <BiCalendar className="text-4xl text-[#0E6073] mr-1" />
                                        <p>Du 04/01/2022 au 10/09/2023</p>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <NavBar />
            </main>
        </>
    );
};

export default ProfileScreen;