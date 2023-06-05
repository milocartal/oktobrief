import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown, BiClipboard, BiListCheck } from "react-icons/bi";
import { FaInbox, FaOctopusDeploy } from "react-icons/fa"
import { FaBell, FaCircle } from "react-icons/fa"
import { BiX } from "react-icons/bi";

interface Props {
    referentiel?: string;
    selected?: number
}

export const NavBar: React.FC<Props> = (props) => {
    const { data: sessionData } = useSession();
    return (
        <div className="fixed top-0 left-0 w-[100px] bg-[#0e6073] h-screen flex flex-col items-center text-white text-sm justify-between pt-5 pb-8 px-2">

            <div className="flex flex-col items-center justify-start gap-[3px]">
                <Link href={"/"}>
                    <img src="/logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enroulé qui forme un O" />
                </Link>
                <Link href={"/briefs"} className="flex flex-col items-center justify-center transition rounded-xl hover:bg-[#2EA3A5] w-full py-3 text-center"><BiClipboard className="text-2xl mb-1" />Projet</Link>
                <Link href={"/admin/suivis"} className="flex flex-col items-center justify-center transition rounded-xl hover:bg-[#2EA3A5] w-full py-3 text-center"><FaInbox className="text-2xl mb-1" />Rendu</Link>
                {(sessionData?.user.formateur || sessionData?.user.superadmin) && <Link href={"/admin/suivis"} className="flex flex-col items-center justify-center transition rounded-xl hover:bg-[#2EA3A5] w-full py-3 text-center"><BiListCheck className="text-2xl mb-1" />Suivi</Link>}
                {props.referentiel && <Link href={`/referentiel/${props.referentiel}`} className="flex flex-col items-center justify-center transition rounded-xl hover:bg-[#2EA3A5] w-full py-3 text-center"><FaOctopusDeploy className="text-2xl mb-1" />Référentiel</Link>}
                {sessionData?.user.superadmin && <Link href={"/superadmin"} className="flex flex-col items-center justify-center transitionn rounded-xl hover:bg-[#2EA3A5] w-full py-3 text-center"><img src="/superhero.svg" className="w-7 mb-1" alt="superhro icon"/>Super Admin</Link>}
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
                        <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Mes projets</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Mes projets</button></Link> :
                            <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Mes projets</button></Link>
                    }
                    {props.selected === 2 ?
                        <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Projets de la promo</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Projets de la promo</button></Link> :
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Projets de la promo</button></Link>
                    }
                    {props.selected === 3 ?
                        <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Explorer</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Explorer</button></Link> :
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Explorer</button></Link>
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
        }
    ]

    return (
        <>
            {open ? <div className="fixed bottom-16 right-16 w-[300px] h-[400px]">
                <div className="bg-white w-full h-[300px] flex flex-col items-start p-5 overflow-auto rounded-lg">
                    <button className="self-end">
                        <p className="text-sm mr-2">Tout effacer</p>
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
                                    <BiX className="text-3xl" />
                                </button>
                            </span>
                        )
                    })}
                </div>
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
                        if(notifs){setNotifs(false)}
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

export const Promos: React.FC = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] text-white rounded-lg" onClick={() => setOpen(!open)}>
                <p className="text-base mr-2">Promo 1 2022/2023</p>
                <BiChevronDown className="text-4xl" />
            </button>
            {open &&
                <div className="w-full absolute bg-white rounded-b-lg flex flex-col items-center divide-y divide-[#0E6073]">
                    <p className="text-sm text-[#0E6073] py-4">Promo 2 2022/2023</p>
                    <p className="text-sm text-[#0E6073] py-4">Promo 3 2022/2023</p>
                    <p className="text-sm text-[#0E6073] py-4">Promo 4 2022/2023</p>
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
                <div className="bg-white absolute left-28 bottom-8 px-5 py-4 w-72">
                    <span className="flex flex-row justify-start items-center">
                        {sessionData?.user.image && <img src={sessionData.user.image} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />}
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
            }
        </div>
    );
};