import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BiClipboard, BiListCheck } from "react-icons/bi";
import { FaInbox, FaOctopusDeploy } from "react-icons/fa"


function NavBar () {
    return(
        <div className="fixed top-0 left-0 w-[100px] bg-[#0e6073] h-screen flex flex-col items-center text-white text-sm justify-between py-5">

            <div className="flex flex-col gap-8 items-center justify-center">
                <img src="logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enroulé qui forme un O" />
                <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><BiClipboard className="text-3xl" />Projet</Link>
                <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><FaInbox className="text-3xl" />Rendu</Link>
                <Link href={""} className="flex flex-col items-center justify-center gap-1 transition hover:bg-[#2EA3A5]"><BiListCheck className="text-3xl" />Suivi</Link>
                <Link href={""} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><FaOctopusDeploy className="text-3xl" />Référentiel</Link>
                <Link href={""} className="flex flex-col items-center justify-center gap-2 transition hover:bg-[#2EA3A5]"><img src="superhero.svg" className="w-10" />Super Admin</Link>
            </div>

            <AuthShowcase />
        </div>
)}

export default NavBar;


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