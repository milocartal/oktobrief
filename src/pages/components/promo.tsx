import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

function Promo () {
  const [open, setOpen] = useState(false)

    return(
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
          <div className="flex flex-row items-center justify-center bg-[#0E6073] text-white rounded-b-lg w-full h-12">
            <p className="text-sm">+ Créer une promo</p>
          </div>
        </div>
        }
      </div>
)}

export default Promo;