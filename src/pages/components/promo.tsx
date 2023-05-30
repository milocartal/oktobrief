import { BiChevronDown } from "react-icons/bi";

function Promo () {
    return(
        <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#0E6073] text-white rounded-lg">
          <p className="text-base mr-2">Promo 1 2022/2023</p>
          <BiChevronDown className="text-4xl" />
        </button>
)}

export default Promo;