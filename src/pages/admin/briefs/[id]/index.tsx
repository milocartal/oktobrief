import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import { NavBar, Notifs } from "~/components/barrel";
import { BiLeftArrowAlt, BiLink, BiCheck, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import { IoChevronUpCircleSharp, IoChevronDownCircleSharp } from "react-icons/io5";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { prisma } from "~/server/db";
import type { BriefWithAll, CategFull } from "~/utils/type";
import { Tag } from "@prisma/client";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import Router from "next/router";

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

const modules = {
    toolbar: [
        [{ header: ['1', '2', '3', false] }],
        //[{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
        [{ color: [] }],
        [
            { list: 'ordered' },
            { list: 'bullet' },
        ],
        ['link'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
}

export const getServerSideProps: GetServerSideProps<{
    brief: BriefWithAll,
    categories: CategFull[]
}> = async function (context) {
    const session = await getSession(context)
    const superadmin = session?.superadmin
    const formateur = session?.formateur

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    const brief = await prisma.brief.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            ressources: {
                include: {
                    tags: true
                }
            },
            referentiel: true,
            tags: true,
            formateur: true,
            Niveaux: {
                include: {
                    competence: true
                }
            }
        }
    })

    const categories = await prisma.categorie.findMany({
        include: {
            tags: true
        }
    })

    return {
        props: {
            brief: JSON.parse(JSON.stringify(brief)) as BriefWithAll,
            categories: JSON.parse(JSON.stringify(categories)) as CategFull[],
        }
    }
};

const Brief: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ brief, categories }) => {
    const createRes = api.ressource.create.useMutation()
    const addRessource = api.ressource.addToBrief.useMutation()
    const delRessource = api.ressource.delete.useMutation()

    const updateBrief = api.brief.update.useMutation()

    //useState

    const [selectedCat, setSelectedCat] = useState<CategFull | null>(() => {
        if (categories.length > 0 && categories[0]) {
            return categories[0]
        }
        return null
    })

    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState("normal")

    const [selectedTags, setSelectedTags] = useState<Tag | null>(null)
    const [SearchTerm, setSearchTerm] = useState('');

    const [desc, setDesc] = useState(brief.desc)
    const [contexte, setContexte] = useState(brief.contexte)
    const [modaPeda, setPeda] = useState(brief.modal_peda)
    const [evals, setEvals] = useState(brief.modal_eval)
    const [livrable, setLivrable] = useState(brief.livrable)
    const [perf, setPerf] = useState(brief.perf)

    const [modifiable1, setModif1] = useState(true)
    const [modifiable2, setModif2] = useState(true)
    const [modifiable3, setModif3] = useState(true)
    const [modifiable4, setModif4] = useState(true)
    const [modifiable5, setModif5] = useState(true)
    const [modifiable6, setModif6] = useState(true)

    //Fonctions

    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    async function handleDelRes(e:React.SyntheticEvent, id: string) {
        e.preventDefault()
        await delRessource.mutateAsync({id: id})
        window.location.reload()
    }

    async function handleUpdate(e: React.SyntheticEvent) {
        e.preventDefault()
        if (desc !== "" && contexte !== "" && modaPeda !== "" && evals !== "" && livrable !== "") {          
            const temp = await updateBrief.mutateAsync({ id: brief.id ,title: brief.title, desc: desc, contexte: contexte, livrable: livrable, perf: perf, idRef: brief.idR, eval: evals, peda: modaPeda })
            window.location.reload()

        }
        else {
            alert("Merci de remplir tous les champs requis")
        }
    }

    async function handleCreaRes(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            ressourceTitle: { value: string };
            imgRessource: { value: string };
            ressourceUrl: { value: string };
        };
        const title = target.ressourceTitle.value
        let img = "/logo-gradient.jpg"
        if (target.imgRessource.value !== "") {
            img = target.imgRessource.value
        }
        const link = target.ressourceUrl.value
        const temp = await createRes.mutateAsync({ title: title, link: link, img: img })
        await addRessource.mutateAsync({ id: temp.id, idBrief: brief.id })
        window.location.reload()
    }

    let briefIlu = "/promo.jpeg";
    if (brief.img) {
        briefIlu = brief.img
    }

    return (
        <>
            <Head>
                <title>{brief.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] px-[50px] gap-5 pb-10">
                <div className="w-full h-[400px] absolute z-0 pl-[100px] flex justify-center">
                    <Image width={1000} height={1000} loader={() => briefIlu} src={briefIlu} className="h-full w-full bg-center bg-cover object-cover" alt="Image de la promo sélectionnée" />
                </div>

                <Link href={`/briefs/${brief.id}`} className="px-5 py-2 bg-[#fff]/40 text-white rounded-lg text-base self-start z-10 absolute top-[50px] flex flex-row items-center justify-between w-32 ml-[100px]"><BiLeftArrowAlt className="text-3xl" /> Retour</Link>

                <div className="flex w-[80%] flex-col items-center justify-start pt-[200px] relative ml-[100px]">
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">{brief.title}</h1>
                            <button>
                                <BiTrash className="text-3xl text-[#A10000]" />
                            </button>
                        </span>
                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Description</h2>
                            {modifiable1 ?
                                <button onClick={() => void setModif1(!modifiable1)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif1(!modifiable1); void setDesc(brief.desc)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable1 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={desc}
                            readOnly={modifiable1}
                            onChange={(e) => { setDesc(e) }}
                        />

                        <div className="flex flex-row justify-between w-full items-center mt-10 mb-5">
                            <span>
                                <h2 className="text-2xl text-black">Référentiel :</h2>
                                <div className="text-lg text-black" dangerouslySetInnerHTML={{ __html: brief.referentiel.title }} />
                            </span>
                            {open ? <button onClick={() => setOpen(!open)}><IoChevronUpCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button> : <button onClick={() => setOpen(!open)}><IoChevronDownCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button>}
                        </div>
                        {open &&
                            <div className="flex flex-row justify-between items-center w-full mb-5">

                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>

                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>

                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>

                            </div>
                        }

                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Contexte du projet</h2>
                            {modifiable2 ?
                                <button onClick={() => void setModif2(!modifiable2)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif2(!modifiable2); void setContexte(brief.contexte)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable2 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={contexte}
                            readOnly={modifiable2}
                            onChange={(e) => { setContexte(e) }}
                        />

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">

                        <h1 className="text-4xl font-semibold text-black">Modalités</h1>

                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Modalités pédagogiques</h2>
                            {modifiable3 ?
                                <button onClick={() => void setModif3(!modifiable3)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif3(!modifiable3); void setPeda(brief.modal_peda)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable3 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={modaPeda}
                            readOnly={modifiable3}
                            onChange={(e) => { setPeda(e) }}
                        />

                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Modalités d&apos;évaluation</h2>
                            {modifiable4 ?
                                <button onClick={() => void setModif4(!modifiable4)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif4(!modifiable4); void setEvals(brief.modal_eval)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable4 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={evals}
                            readOnly={modifiable4}
                            onChange={(e) => { setEvals(e) }}
                        />

                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Livrables</h2>
                            {modifiable5 ?
                                <button onClick={() => void setModif5(!modifiable5)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif5(!modifiable5); void setLivrable(brief.livrable)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable5 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={livrable}
                            readOnly={modifiable5}
                            onChange={(e) => { setLivrable(e) }}
                        />

                        <span className="flex w-full justify-between items-center">
                            <h2 className="text-2xl text-black mt-5 mb-2">Critères de performance</h2>
                            {modifiable6 ?
                                <button onClick={() => void setModif6(!modifiable6)}>
                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                </button> :
                                <span className="flex gap-5">
                                    <button onClick={() => {void setModif6(!modifiable6); void setPerf(brief.perf)}} className="text-[#A10000] hover:cursor-pointer">Annuler</button>
                                    <button
                                        className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg"
                                        onClick={(e) => handleUpdate(e)}>
                                        Enregistrer
                                    </button>
                                </span>

                            }
                        </span>
                        <QuillNoSSRWrapper
                            theme="snow"
                            className={`pb-11 bg-white w-full h-[150px] ${modifiable6 ? "text-gray-500" : "text-black"}`}
                            modules={modules}
                            defaultValue={perf}
                            readOnly={modifiable6}
                            onChange={(e) => { setPerf(e) }}
                        />

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">Ressources du projet</h1>
                            <div className="flex flex-row justify-end w-[60%]">
                                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[40%] min-w-[200px] max-w-[400px] flex flex-row justify-between items-center mr-2">
                                    <BiSearch className="text-3xl text-black ml-4" />
                                    <input
                                        type='text'
                                        name="searchProject"
                                        className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                        autoComplete="off"
                                    />
                                </div>
                                <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg" onClick={() => setTab("ressource")}>Ajouter une ressource</button>
                            </div>
                        </span>
                        <div className="flex flex-col w-full gap-3">
                            {brief.ressources && brief.ressources.length > 0 && brief.ressources.map((item) => {
                                return (
                                    <div className="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-row justify-between items-center w-full pl-5 h-[230px]">
                                        <div className="w-[50%] flex flex-col items-start my-5">
                                            <h2 className="text-2xl text-black">{item.title}</h2>
                                            <Link href={item.link} className="text-sm text-start text-[#0e6073]">{item.link}</Link>
                                        </div>
                                        <div className="w-[25%] h-full flex flex-col items-center justify-start my-5 py-5">
                                            <span className="flex flex-row justify-around self-end items-center w-24 mb-5">
                                                <button>
                                                    <BiPencil className="text-3xl text-[#2EA3A5]" />
                                                </button>
                                                <button onClick={(e)=> void handleDelRes(e, item.id)}>
                                                    <BiTrash className="text-3xl text-[#A10000]" />
                                                </button>
                                            </span>
                                            <div className=" w-full grid grid-cols-2 gap-2 content-stretch">
                                                {item.tags && item.tags.map((tag) => {
                                                    return (
                                                        <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full" key={tag.id}>
                                                            <p className="text-sm">{tag.name}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <Image width={1000} height={1500} loader={() => item.img} src={item.img} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la promo sélectionnée" />
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                <Notifs />
                <NavBar />
                {tab === "ressource" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form onSubmit={(e) => void handleCreaRes(e)} className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-lg p-10 w-8/12 max-h-[90%] text-[#041f25]" method="POST">
                            <span className="flex flex-row justify-between">
                                <h1 className="text-3xl text-black">Créer une ressource</h1>
                                <p className="text-base text-[#A10000]">*Obligatoire</p>
                            </span>
                            <div className="w-full h-full max-h-[50%] flex flex-row justify-between items-start">
                                <fieldset className="w-[38%]">
                                    <fieldset>
                                        <label htmlFor='ressourceTitle'>Titre de la ressource <span className="text-[#A10000] text-1xl">*</span></label>
                                        <input
                                            type='text'
                                            name="ressourceTitle"
                                            id="ressourceTitle"
                                            className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                            autoComplete="off" />
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor='imgRessource'>Image de la ressource</label>
                                        <input
                                            type="url"
                                            name="imgRessource"
                                            id="imgRessource"
                                            className="px-[1rem] py-3 w-full rounded-lg shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                            placeholder="url de l'image"
                                            autoComplete="off" />
                                    </fieldset>
                                </fieldset>

                                <div className="w-[60%] h-full">
                                    <fieldset>
                                        <label htmlFor='ressourceUrl'>URL de la ressource <span className="text-[#A10000] text-1xl">*</span></label>
                                        <input
                                            type='url'
                                            name="ressourceUrl"
                                            id="ressourceUrl"
                                            className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                            autoComplete="off" />
                                    </fieldset>
                                    <p>Tags</p>

                                    <div className="w-full flex flex-row justify-between min-h-[300px] h-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                                        <div className="w-[40%] h-full max-h-[300px] bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-l-lg flex flex-col items-start py-5 overflow-auto">
                                            <div className="pr-5 rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[80%] flex flex-row justify-between items-center self-center mr-2 mb-3">
                                                <BiSearch className="text-3xl text-black ml-4" />
                                                <input
                                                    type='text'
                                                    name="searchProject"
                                                    className="pr-[1rem] pl-1 py-2 w-full bg-transparent"
                                                    autoComplete="off"
                                                    onChange={handleSearchTerm}
                                                />
                                            </div>
                                            {categories.filter((cat) => {
                                                return cat.name.toLowerCase().includes(SearchTerm.toLowerCase())
                                            }).map((item) => {
                                                return (
                                                    <>
                                                        {selectedCat === item ?
                                                            <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between bg-[#2EA3A5] text-white" key={item.id} onClick={() => setSelectedCat(item)}>
                                                                <p>{item.name}</p>
                                                                <p>({item.tags.length})</p>
                                                            </button>
                                                            :
                                                            <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between" key={item.id} onClick={() => setSelectedCat(item)}>
                                                                <p>{item.name}</p>
                                                                <p>({item.tags.length})</p>
                                                            </button>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                        <div className="w-[66%] h-full p-3 flex flex-row flex-wrap">
                                            {selectedCat?.tags.map((item) => {
                                                return (
                                                    <>
                                                        {selectedTags === item ?
                                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#2EA3A5] text-white" key={item.id}>{item.name}</button>
                                                            :
                                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id}>{item.name}</button>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="self-end flex items-center">
                                <div onClick={() => setTab("normal")} className="text-[#A10000] hover:cursor-pointer">Annuler</div>
                                <button type="submit" className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10">Ajouter la ressource</button>
                            </span>
                        </form>
                    </div>
                }
            </main>
        </>
    );
};

export default Brief;