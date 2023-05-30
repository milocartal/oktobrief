import { GetServerSideProps, type NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { BiClipboard, BiListCheck, BiChevronDown, BiGroup, BiCalendar } from "react-icons/bi";
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

const SuperAdmin: NextPage = () => {

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
                <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
                    <span className="flex w-full flex-row items-center justify-between mb-10">
                        <h1 className="text-4xl font-extrabold text-black">Votre dashboard super admin</h1>
                        <div className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] text-white rounded-lg">
                            <p className="text-xl mr-2">Promo 1 2022/2023</p>
                            <BiChevronDown className="text-4xl" />
                        </div>
                    </span>

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 gap-5 rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Données sur la plateforme</h2>
                        </span>

                        <div className="flex w-full flex-row items-center justify-center gap-16">
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-7xl mb-2 text-[#2EA3A5]">76</h3>
                                <p className="text-3xl mb-5 text-[#0E6073] font-[700]">Apprenants</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-7xl mb-2 text-[#2EA3A5]">26</h3>
                                <p className="text-3xl mb-5 text-[#0E6073] font-[700]">Promos créées</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-7xl mb-2 text-[#2EA3A5]">62</h3>
                                <p className="text-3xl mb-5 text-[#0E6073] font-[700]">Projets créés</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Les dernières promos créées</h2>
                            <span className="flex w-[45%] flex-row items-center justify-end">
                                <div className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                                    <p className="text-lg">Gérer les promos</p>
                                </div>
                            </span>
                        </span>

                        <div className="flex gap-3">
                            <div className="flex flex-col drop-shadow-md w-[35%] bg-white rounded-xl gap-3">
                                <div className="w-full h-[170px]"><img src="promo.jpeg" className="w-full h-full object-cover rounded-t-xl" alt="Image de la promo sélectionnée" /></div>
                                <h3 className="text-[20px] px-5">Promo 1 2022/2023</h3>
                                <p className="text-[14px] px-5 pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                            </div>

                            <div className="flex flex-col drop-shadow-md w-[35%] bg-white rounded-xl gap-3">
                                <div className="w-full h-[170px]"><img src="promo.jpeg" className="w-full h-full object-cover rounded-t-xl" alt="Image de la promo sélectionnée" /></div>
                                <h3 className="text-[20px] px-5">Promo 1 2022/2023</h3>
                                <p className="text-[14px] px-5 pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                            </div>

                            <div className="flex flex-col drop-shadow-md w-[35%] bg-white rounded-xl gap-3">
                                <div className="w-full h-[170px]"><img src="promo.jpeg" className="w-full h-full object-cover rounded-t-xl" alt="Image de la promo sélectionnée" /></div>
                                <h3 className="text-[20px] px-5">Promo 1 2022/2023</h3>
                                <p className="text-[14px] px-5 pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales euismod blandit.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] mb-5 rounded-xl gap-5">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h2 className="text-2xl text-black">Les référentiels</h2>
                            <span className="flex w-[60%] flex-row items-center justify-end gap-5">
                                <input
                                    type='text'
                                    name="leconTitle"
                                    placeholder=""
                                    className="px-[1rem] py-3 rounded-full bg-white shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-[55%] flex text-center"
                                    autoComplete="off"
                                />
                                <Link href={"/superadmin/referentiel/creer"} className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg ">
                                    <p className="text-lg text-center">Créer un référentiel</p>
                                </Link>
                            </span>
                        </span>
                        <div className="grid grid-cols-4 gap-3">
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link> <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>

                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                            <Link href={""} className="flex justify-center items-center bg-white drop-shadow-md px-4 py-3 rounded-xl text-center">
                                <p className="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Link>
                        </div>
                    </div>

                </div>



                <div className="fixed top-0 left-0 w-[100px] bg-[#0e6073] h-screen flex flex-col items-center text-white text-sm justify-between py-5">

                    <div className="flex flex-col gap-8 items-center justify-center">
                        <Link href={"/"}><img src="logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enroulé qui forme un O" /></Link>
                        <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><BiClipboard className="text-3xl" />Projet</Link>
                        <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><FaInbox className="text-3xl" />Rendu</Link>
                        <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><BiListCheck className="text-3xl" />Suivi</Link>
                        <Link href={""} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><FaOctopusDeploy className="text-3xl" />Référentiel</Link>
                        <Link href={"/superadmin"} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><img src="superhero.svg" className="w-10" />Super Admin</Link>
                    </div>

                    <AuthShowcase />
                </div>
            </main>
        </>
    );
};

export default SuperAdmin;

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