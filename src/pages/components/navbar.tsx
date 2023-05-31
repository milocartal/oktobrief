import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BiClipboard, BiListCheck } from "react-icons/bi";
import { FaInbox, FaOctopusDeploy } from "react-icons/fa"

const NavBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-[100px] bg-[#0e6073] h-screen flex flex-col items-center text-white text-sm justify-between pt-5 pb-8 px-2">

      <div className="flex flex-col items-center justify-start">
        <Link href={"/"}>
          <img src="/logo-carre.png" className="max-w-[4rem] mb-5" alt="Logo de la société Oktopod réprésentant un pouple enroulé qui forme un O" />
        </Link>
        <Link href={""} className="flex flex-col items-center justify-center transition hover:bg-[#2EA3A5] w-full py-3 text-center"><BiClipboard className="text-2xl mb-1" />Projet</Link>
        <Link href={""} className="flex flex-col items-center justify-center transition hover:bg-[#2EA3A5] w-full py-3 text-center"><FaInbox className="text-2xl mb-1" />Rendu</Link>
        <Link href={""} className="flex flex-col items-center justify-center transition hover:bg-[#2EA3A5] w-full py-3 text-center"><BiListCheck className="text-2xl mb-1" />Suivi</Link>
        <Link href={""} className="flex flex-col items-center justify-center transition hover:bg-[#2EA3A5] w-full py-3 text-center"><FaOctopusDeploy className="text-2xl mb-1" />Référentiel</Link>
        <Link href={"/superadmin"} className="flex flex-col items-center justify-center transition hover:bg-[#2EA3A5] w-full py-3 text-center"><img src="/superhero.svg" className="w-7 mb-1" />Super Admin</Link>
      </div>

      <AuthShowcase />
    </div>
  )
}

export default NavBar;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-row items-center justify-center">
      <button
        className="rounded-full font-semibold no-underline transition"
        onClick={() => setOpen(!open)}
      >
        {sessionData ? sessionData.user.image ? <img src={sessionData.user.image} className="w-[4rem] h-[4rem] object-cover rounded-full" /> : <p className="mx-10 my-3">{sessionData.user.name}</p> : <p className="mx-3 my-3">Sign In</p>}
      </button>
      {open &&
        <div className="bg-white absolute left-28 bottom-8 px-5 py-2 w-72">
          <span className="flex flex-row justify-start items-center">
            {sessionData?.user.image && <img src={sessionData.user.image} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />}
            <div>
              <p className="text-base text-black font-semibold">{sessionData?.user.name}</p>
              <p className="text-sm text-black">{sessionData?.user.email}</p>
            </div>
          </span>
          <span className="flex flex-row justify-between items-center mt-5">
            <button>
              <p className="text-sm text-black hover:text-[#2EA3A5]">Gérer mon profil</p>
            </button>
            <button onClick={sessionData ? () => void signOut() : () => void signIn()}>
              <p className="text-sm text-[#8F0000]">Déconnexion</p>
            </button>
          </span>
        </div>
      }
    </div>
  );
};