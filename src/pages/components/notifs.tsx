import { FaBell, FaCircle } from "react-icons/fa"
import { useState } from "react";

function Notifs () {
    const [notifs, setNotifs] = useState(true)

    return(
        <div className="fixed bottom-16 right-16 w-20 h-20 bg-[#2EA3A5] flex flex-row items-center justify-center rounded-full">
            <div className="w-full h-full flex flex-row items-center justify-center rounded-full relative">
            <FaBell className="text-3xl text-white" />
            {notifs && <FaCircle className="text-base text-[#0E6073] absolute top-5 right-5" />}
            </div>
        </div>
)}

export default Notifs;