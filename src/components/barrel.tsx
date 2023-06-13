import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown, BiChevronUp, BiClipboard, BiListCheck } from "react-icons/bi";
import { FaInbox, FaOctopusDeploy } from "react-icons/fa"
import { FaBell, FaCircle } from "react-icons/fa"
import { BiX } from "react-icons/bi";
import { type Promo } from "@prisma/client";

interface Props {
    referentiel?: string;
    selected?: number
}

interface PropsUser {
    promos?: Promo[];
}


export const NavBar: React.FC = () => {
    const { data: sessionData } = useSession();
    return (
        <div className="fixed top-0 left-0 w-[100px] bg-gradient-to-tr from-[#0e6073] to-[#33a5a6] h-screen flex flex-col items-center text-white text-sm justify-between pt-5 pb-8 px-2">

            <div className="flex flex-col items-center justify-start gap-[3px]">
                <Link href={"/"}>
                    <img src="/logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enroulé qui forme un O" />
                </Link>
                <Link href={"/briefs"} className="flex flex-col items-center justify-center transition px-2 hover:bg-[#2EA3A5] w-full py-3 text-center"><BiClipboard className="text-2xl mb-1" />Projet</Link>
                <Link href={"/admin/suivis"} className="flex flex-col items-center justify-center transition px-2 hover:bg-[#2EA3A5] w-full py-3 text-center"><FaInbox className="text-2xl mb-1" />Rendu</Link>
                {(sessionData?.formateur || sessionData?.user.superadmin) && <Link href={"/admin/suivis"} className="flex flex-col items-center justify-center transition px-2 hover:bg-[#2EA3A5] w-full py-3 text-center"><BiListCheck className="text-4xl mb-1" />Suivi</Link>}
                {sessionData?.promo.referentiel && <Link href={`/referentiel/${sessionData?.promo.referentiel.id}`} className="flex flex-col items-center justify-center transition px-2 hover:bg-[#2EA3A5] w-full py-3 text-center"><FaOctopusDeploy className="text-2xl mb-1" />Référentiel</Link>}
                {sessionData?.superadmin && <Link href={"/superadmin"} className="flex flex-col items-center justify-center transition px-2 hover:bg-[#2EA3A5] w-full py-3 text-center"><img src="/superhero.svg" className="w-7 mb-1" alt="superhero icon" />Super Admin</Link>}
            </div>

            <AuthShowcase />
        </div>
    )
}

export const Header: React.FC<Props> = (props) => {
    return (
        <>
            <div className="fixed w-full bg-transparent top-0 h-[4rem]" />
            {props.selected === 404 ? <div className="fixed w-full pr-40 border-b-4 border-[#fff] bg-[#F3F3F3] top-0 right-0 left-28 h-[4rem]" /> : <div className="fixed w-full pr-40 border-b-4 border-[#63aeab] bg-[#F3F3F3] dark:bg-[#082F38] top-0 right-0 left-28 h-[4rem]" />}

            <div className="flex justify-between gap-12 fixed w-full pr-40 top-0 right-0 left-28 h-[4rem] text-[#63aeab]">
                <div className="flex justify-evenly">
                    {props.selected === 1 ?
                        <Link href={`/briefs`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Mes projets</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/briefs`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Mes projets</button></Link> :
                            <Link href={`/briefs`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Mes projets</button></Link>
                    }
                    {props.selected === 2 ?
                        <Link href={`/briefs/promo-briefs`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Projets de la promo</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/briefs/promo-briefs`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Projets de la promo</button></Link> :
                            <Link href={`/briefs/promo-briefs`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Projets de la promo</button></Link>
                    }
                    {props.selected === 3 ?
                        <Link href={`/briefs/explorer`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Explorer</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/briefs/explorer`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Explorer</button></Link> :
                            <Link href={`/briefs/explorer`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Explorer</button></Link>
                    }
                </div>

            </div>
        </>
    );
}

export const Notifs: React.FC = () => {
    const [notifs, setNotifs] = useState(true)
    const [open, setOpen] = useState(false)

    const DATA = [
        {
            "id": 1,
            "nom": "Lorem Ipsum",
            "message": "A rendu le devoir lorem ipsum dolor sit amet"

        },
        {
            "id": 2,
            "nom": "Lorem Ipsum",
            "message": "Vous a envoyé un message"
        },
        {
            "id": 3,
            "nom": "Lorem Ipsum",
            "message": "A rendu le devoir lorem ipsum dolor sit amet"

        },
        {
            "id": 4,
            "nom": "Lorem Ipsum",
            "message": "Vous a envoyé un message"
        },
        {
            "id": 5,
            "nom": "Lorem Ipsum",
            "message": "A rendu le devoir lorem ipsum dolor sit amet"

        },
        {
            "id": 6,
            "nom": "Lorem Ipsum",
            "message": "Vous a envoyé un message"
        }
    ]

    return (
        <>
            {open ? <div className="fixed bottom-16 right-16 w-[300px] h-[500px]">
                <div className="bg-white w-full h-[400px] flex flex-col items-start p-5 overflow-auto rounded-lg">
                    <button className="self-end">
                        <p className="text-sm mr-2 hover:text-[#8F0000]">Tout effacer</p>
                    </button>
                    {DATA.map((item) => {
                        return (
                            <span className="flex flex-row justify-start items-center w-full mt-5" key={item.id}>
                                <img src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                                <div>
                                    <p className="text-base text-black font-semibold">{item.nom}</p>
                                    <p className="text-sm text-black mr-1">{item.message}</p>
                                </div>
                                <button className="w-[10%]">
                                    <BiX className="text-3xl hover:text-[#8F0000]" />
                                </button>
                            </span>
                        )
                    })}
                </div>
                <div className="w-0 h-0 border-t-[20px] border-t-white  border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent absolute right-[20px]"></div>
                <button className="pointer-events-auto fixed bottom-16 right-16 w-20 h-20 bg-[#2EA3A5] flex flex-row items-center justify-center rounded-full" onClick={() => setOpen(!open)}>
                    <div className="w-full h-full flex flex-row items-center justify-center rounded-full relative">
                        <FaBell className="text-3xl text-white" />
                        {notifs && <FaCircle className="text-base text-[#0E6073] absolute top-5 right-5" />}
                    </div>
                </button>
            </div>
                :
                <div className="fixed bottom-16 right-16">
                    <button className="pointer-events-auto fixed bottom-16 right-16 w-20 h-20 bg-[#2EA3A5] flex flex-row items-center justify-center rounded-full" onClick={() => {
                        setOpen(!open)
                        if (notifs) { setNotifs(false) }
                    }}>
                        <div className="w-full h-full flex flex-row items-center justify-center rounded-full relative">
                            <FaBell className="text-3xl text-white" />
                            {notifs && <FaCircle className="text-base text-[#0E6073] absolute top-5 right-5" />}
                        </div>
                    </button>
                </div>
            }
        </>
    )
}

export const Promos: React.FC<PropsUser> = (props) => {
    const [open, setOpen] = useState(false)
    const { data: sessionData, update } = useSession();
    const promos = props.promos

    return (
        <div className="relative">

            <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] min-w-[200px] text-white rounded-lg" onClick={() => setOpen(!open)}>
                {sessionData && sessionData.promo && <p className="text-base mr-2">{sessionData?.promo.title}</p>}
                {open ? <BiChevronUp className="text-4xl" /> : <BiChevronDown className="text-4xl" />}
            </button>
            {open &&
                <div className="w-full absolute bg-white rounded-b-lg flex flex-col items-center divide-y divide-[#0E6073] min-w-[200px]">
                    {promos && promos.length > 0 && promos.map((item) => {
                        if (item.id !== sessionData!.promo.id) {
                            return (
                                <button className="text-sm text-[#0E6073] py-4" onClick={() => { void update({ promo: item }), setOpen(false), window.location.reload() }} key={item.id}>{item.title}</button>
                            )
                        }
                    })}

                    <Link href={"/admin/promo/creer"} className="flex flex-row items-center justify-center bg-[#0E6073] text-white rounded-b-lg w-full h-12">
                        <p className="text-sm">+ Créer une promo</p>
                    </Link>
                </div>
            }
        </div>
    )
}

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-row items-center justify-center">
            <button
                className="rounded-full font-semibold no-underline transition"
                onClick={() => setOpen(!open)}
            >
                {sessionData ? sessionData.user.image && sessionData.user.name ? <img src={sessionData.user.image} className="w-[4rem] h-[4rem] object-cover rounded-full" alt={sessionData.user.name} /> : <p className="mx-10 my-3">{sessionData.user.name}</p> : <p className="mx-3 my-3">Sign In</p>}
            </button>
            {open &&
            <>
                <div className="w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-r-[25px] border-r-white absolute left-[100px]"></div>
                <div className="bg-white absolute left-28 bottom-8 px-5 py-4 w-72">
                    <span className="flex flex-row justify-start items-center">
                        {sessionData?.user.image && (sessionData?.user.image.includes("http://") || sessionData?.user.image.includes("https://")) && <img src={sessionData.user.image} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />}
                        <div>
                            <p className="text-base text-black font-semibold">{sessionData?.user.name}</p>
                            <p className="text-sm text-black">{sessionData?.user.email}</p>
                        </div>
                    </span>
                    <span className="flex flex-row justify-between items-center mt-5">
                        <Link href={`/user/${sessionData!.user.id}`}>
                            <p className="text-sm text-black hover:text-[#2EA3A5]">Gérer mon profil</p>
                        </Link>
                        <button onClick={sessionData ? () => void signOut() : () => void signIn()}>
                            <p className="text-sm text-[#8F0000]">Déconnexion</p>
                        </button>
                    </span>
                </div>
            </>
            }
        </div>
    );
};