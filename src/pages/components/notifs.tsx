import { FaBell, FaCircle } from "react-icons/fa"
import { BiX } from "react-icons/bi";
import { useState } from "react";

function Notifs () {
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

    return(
        <div className="fixed bottom-16 right-16 w-[300px] h-[400px]">
            {open && 
                <div className="bg-white w-full h-[300px] flex flex-col items-start p-5 overflow-auto rounded-lg">
                    <button className="self-end">
                        <p className="text-sm mr-2">Tout effacer</p>
                    </button>
                    {DATA.map((item) => {
                        return (
                            <span className="flex flex-row justify-start items-center w-full mt-5" key={item.id}>
                                <img src="userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur"/>
                                <div>
                                    <p className="text-base text-black font-semibold">{item.nom}</p>
                                    <p className="text-sm text-black mr-1">{item.message}</p>
                                </div>
                                <button className="w-[10%]">
                                    <BiX className="text-3xl"/>
                                </button>
                            </span>
                        )
                    })}
                </div>
            }
            <button className="fixed bottom-16 right-16 w-20 h-20 bg-[#2EA3A5] flex flex-row items-center justify-center rounded-full" onClick={() => setOpen(!open)}>
                <div className="w-full h-full flex flex-row items-center justify-center rounded-full relative">
                    <FaBell className="text-3xl text-white" />
                    {notifs && <FaCircle className="text-base text-[#0E6073] absolute top-5 right-5" />}
                </div>
            </button>
        </div>
)}

export default Notifs;