import Link from "next/link";

function Header (props:{selected: number}) {
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

export default Header;