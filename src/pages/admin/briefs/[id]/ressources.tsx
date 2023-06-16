import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import { NavBar } from "~/components/barrel";
import dynamic from "next/dynamic";
import { useState } from "react";
import { api } from "~/utils/api";
import Router from "next/router";

import { BiChevronDown, BiChevronUp, BiPencil, BiSearch, BiTrash } from "react-icons/bi";
import { Ressource, Tag } from "@prisma/client";
import { prisma } from "~/server/db";
import { BriefWithAll, CategFull } from "~/utils/type";


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
    ressource: Ressource,
    brief: BriefWithAll,
    categories: CategFull[]
}> = async function (context) {
    const session = await getSession(context)

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

    if (!brief) {
        return {
            redirect: {
                destination: '/briefs',
                permanent: false,
            },
        }
    }

    const ressource = await prisma.ressource.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            briefs: true
        }
    })

    const categories = await prisma.categorie.findMany({
        include: {
            tags: true
        }
    })

    return {
        props: {
            ressource: JSON.parse(JSON.stringify(ressource)) as Ressource,
            brief: JSON.parse(JSON.stringify(brief)) as BriefWithAll,
            categories: JSON.parse(JSON.stringify(categories)) as CategFull[],
        }
    }
};

const AddBrief: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ ressource, categories, brief }) => {

    const [selectedCateg, setCateg] = useState(() => {
        if (categories.length > 0) {
            return categories[0]
        }
        else {
            return null
        }
    })

    /*const [selectedLvl, setLvl] = useState(() => {
        if (referentiel.competences.length > 0) {
            if (referentiel.competences[0]!.niveaux.length > 0) {
                return referentiel.competences[0]!.niveaux[0]
            }
        }
        else {
            return null
        }
    })*/

    const [selectedCat, setSelectedCat] = useState<CategFull | null>(() => {
        if (categories.length > 0 && categories[0]) {
            return categories[0]
        }
        return null
    })

    const [selectedTags, setSelectedTags] = useState<Tag | null>(null)
    const [SearchTerm, setSearchTerm] = useState('');

    const { data: sessionData } = useSession()
    const idRef = sessionData?.promo.idRef

    const createBrief = api.brief.create.useMutation()

    const createRes = api.ressource.create.useMutation()
    const addRessource = api.ressource.addToBrief.useMutation()

    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    async function handleCrea(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            briefImg: { value: string };
        };

        const url = target.briefImg.value
        if (idRef) {
            await Router.push(`/admin/briefs`)
        }
        alert("créer")
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

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">

                <h1 className="text-4xl font-extrabold text-black w-full">Créer un projet : Description générel</h1>

                <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl mb-10">

                    <form onSubmit={(e) => void handleCrea(e)} className="flex w-full flex-col items-center justify-start gap-5" method="POST">

                        <fieldset className="w-full flex flex-col gap-2">
                            <label htmlFor="briefImg" className="text-2xl text-black w-full">Image du projet</label>
                            <input
                                type='url'
                                name="briefImg"
                                id="briefImg"
                                className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_0px_2px_9px_4px_rgba(0,0,0,0.25)] w-full"
                                autoComplete="off"
                                placeholder="Titre du projet"
                            />
                        </fieldset>

                        <button type="submit" className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-lg">
                            Ajouter les compétences
                        </button>

                    </form>

                    <aside className="flex flex-col w-full">
                        <div className="flex w-full justify-between gap-1">
                            {categories.map((item, index) => {
                                return (
                                    <button
                                        className={`flex flex-col gap-3 text-md text-black w-4/12 justify-center items-center rounded-t-xl py-2 border-[#f3f3f3] ${selectedCateg && selectedCateg.id === item.id ? 'bg-white border-t-2 border-l-2 border-r-2' : 'bg-[#f3f3f3] border-0'}`}
                                        onClick={() => setCateg(categories[index])}
                                        key={item.id}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-row gap-5 w-full border-[#f3f3f3] border-b-2 border-l-2 border-r-2 px-5 py-5 rounded-b-xl pb-[16px]">
                            {selectedCateg && selectedCateg.tags.map((item) => {
                                return (
                                    <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id}>{item.name}</button>
                                )
                            })}
                        </div>
                    </aside>

                    <form className="relative flex flex-col gap-5 item-center justify-between rounded-lg text-[#041f25]" method="POST">
                        <span className="flex flex-row justify-between">
                            <span className="flex flex-row justify-between items-center">
                                <h1 className="text-3xl text-black">Créer une ressource</h1>
                            </span>
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
                        <span className="self-end flex items-center mt-32">
                            <div className="text-[#A10000] hover:cursor-pointer">Annuler</div>
                            <button type="submit" className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10">Enregistrer</button>
                        </span>
                    </form>

                </section>



                <NavBar />
                {tab === "tags" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-lg p-10 w-10/12 text-[#041f25]">
                        <h1 className="text-3xl text-black">Gérer les tags</h1>
                        <div className="w-full h-full flex flex-row justify-between items-start">
                            <div className="w-[55%] h-full">
                            <div className="w-full flex flex-row justify-between min-h-[450px] h-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                                <div className="w-[40%] h-full max-h-[450px] bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-l-lg flex flex-col items-start py-5 overflow-auto">
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
                                        {selectedCat == item ?
                                        <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between bg-[#2EA3A5] text-white" key={item.id} onClick={() => setSelectedCat(item.id)}>
                                            <p>{item.name}</p>
                                        </button>
                                        :
                                        <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between" key={item.id} onClick={() => setSelectedCat(item.id)}>
                                            <p>{item.name}</p>
                                        </button>
                                        }
                                    </>
                                    )
                                })}
                                </div>
                                <div className="w-[66%] h-full flex flex-col justify-start">
                                <div className="w-full h-16 p-3 px-6 flex flex-row justify-between items-center bg-[#2EA3A5] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-tr-lg">
                                    <p className="text-white">{selectedCat?.name}</p>
                                    <div className="flex flex-row items-center justify-between w-16">
                                    <button type="button" onClick={() => setModifyCat(selectedCat?.id)}><BiPencil className="text-2xl text-white" /></button>
                                    <button type="button"><BiTrash className="text-2xl text-[#A10000]" /></button>
                                    </div>
                                </div>
                                <div className="w-full h-full p-3 flex flex-row flex-wrap">
                                    {selectedCat?.tags.map((item) => {
                                    return (
                                        <>
                                        {item.id == modifyTag ?
                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#2EA3A5] text-white" key={item.id} onClick={() => setModifyTag(item.id)}>{item.title}</button>
                                            :
                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id} onClick={() => setModifyTag(item.id)}>{item.title}</button>
                                        }
                                        </>
                                    )
                                    })}
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="w-[43%]">
                            <button className=" w-full flex flex-row justify-between border-b-2 py-3" type="button" onClick={() => { creating == "tag" ? setCreating("") : setCreating("tag") }}>
                                Créer un tag
                                {creating == "tag" ? <BiChevronUp className="text-2xl" /> : <BiChevronDown className="text-2xl" />}
                            </button>
                            {creating == "tag" && modifyTag == 0 &&
                                <>
                                <div className="mt-5 flex flex-col">
                                    <fieldset>
                                    <label htmlFor='newTagTitle'>Titre du tag <span className="text-[#A10000] text-1xl">*</span></label>
                                    <input
                                        type='url'
                                        name="newTagTitle"
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                        autoComplete="off" />
                                    </fieldset>

                                    <span className="flex flex-row justify-between items-center">
                                    <p>Catégorie(s) du tag</p>
                                    <div className="pr-5 rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[40%] flex flex-row justify-between items-center self-center mr-2 mb-3">
                                        <BiSearch className="text-3xl text-black ml-4" />
                                        <input
                                        type='text'
                                        name="searchProject"
                                        className="pr-[1rem] pl-1 py-2 w-full bg-transparent"
                                        autoComplete="off"
                                        onChange={handleSearchTerm}
                                        />
                                    </div>
                                    </span>
                                    <div className="w-full h-full p-3 flex flex-row justify-between flex-wrap">
                                    {categories.filter((cat) => {
                                        return cat.name.toLowerCase().includes(SearchTerm.toLowerCase())
                                    }).map((item) => {
                                        return (
                                        <>
                                            {item == selectedCat ?
                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#2EA3A5] text-white" key={item.id}>{item.title}</button>
                                            :
                                            <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id}>{item.title}</button>
                                            }
                                        </>
                                        )
                                    })}
                                    </div>
                                    <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10 self-end" onClick={() => { setModifyTag(0) }}>Créer</button>
                                </div>
                                </>
                            }
                            <button className=" w-full flex flex-row justify-between border-b-2 py-3" type="button" onClick={() => { creating == "cat" ? setCreating("") : setCreating("cat") }}>
                                <p>Créer une catégorie</p>
                                {creating == "cat" ? <BiChevronUp className="text-2xl" /> : <BiChevronDown className="text-2xl" />}
                            </button>
                            {creating == "cat" && modifyTag == 0 &&
                                <>
                                <div className="mt-5 flex flex-col">
                                    <fieldset>
                                    <label htmlFor='newCatTitle'>Titre de la catégorie <span className="text-[#A10000] text-1xl">*</span></label>
                                    <input
                                        type='url'
                                        name="newCatTitle"
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                        autoComplete="off" />
                                    </fieldset>
                                    <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10 self-end" onClick={() => { setModifyTag(0) }}>Créer</button>
                                </div>
                                </>
                            }
                            {selectedCat?.tags.map((item) => {
                                return (
                                <>
                                    {item.id == modifyTag && modifyCat == 0 &&
                                    <div className="mt-5 flex flex-col">
                                        <fieldset>
                                        <label htmlFor='tagUpdateTitle'>Titre du tag <span className="text-[#A10000] text-1xl">*</span></label>
                                        <input
                                            type='url'
                                            placeholder={item.name}
                                            name="tagUpdateTitle"
                                            className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                            autoComplete="off" />
                                        </fieldset>

                                        <span className="flex flex-row justify-between items-center">
                                        <p>Catégorie(s) du tag</p>
                                        <div className="pr-5 rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[40%] flex flex-row justify-between items-center self-center mr-2 mb-3">
                                            <BiSearch className="text-3xl text-black ml-4" />
                                            <input
                                            type='text'
                                            name="searchProject"
                                            className="pr-[1rem] pl-1 py-2 w-full bg-transparent"
                                            autoComplete="off"
                                            onChange={handleSearchTerm}
                                            />
                                        </div>
                                        </span>
                                        <div className="w-full h-full p-3 flex flex-row justify-between flex-wrap">
                                        {categories.filter((cat) => {
                                            return cat.name.toLowerCase().includes(SearchTerm.toLowerCase())
                                        }).map((item) => {
                                            return (
                                            <>
                                                {item == selectedCat ?
                                                <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#2EA3A5] text-white" key={item.id}>{item.name}</button>
                                                :
                                                <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id}>{item.name}</button>
                                                }
                                            </>
                                            )
                                        })}
                                        </div>
                                        <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10 self-end" onClick={() => { setModifyTag(0) }}>Enregistrer</button>
                                    </div>
                                    }
                                </>
                                )
                            })}
                            {selectedCat?.id == modifyCat && modifyTag == 0 &&
                                <div className="mt-5 flex flex-col">
                                <fieldset>
                                    <label htmlFor='catUpdateTitle'>Titre de la catégorie <span className="text-[#A10000] text-1xl">*</span></label>
                                    <input
                                    type='url'
                                    placeholder={selectedCat?.name}
                                    name="catUpdateTitle"
                                    className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                                    autoComplete="off" />
                                </fieldset>
                                <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10 self-end" onClick={() => { setModifyCat(0) }}>Enregistrer</button>
                                </div>
                            }
                            </div>

                        </div>
                        <span className="self-end">
                            <button onClick={() => setTab("normal")} className="text-[#A10000]">Annuler</button>
                            <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10">Enregistrer modifications</button>
                        </span>
                        </form>
                    </div>
                    }
            </main>
        </>
    );
};

export default AddBrief;