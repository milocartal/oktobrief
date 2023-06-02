import { type NextPage } from "next";
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import { getSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";

import { NavBar } from "~/components/barrel";
import { useState } from "react";
import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/db";
import { BiPencil, BiTrash } from "react-icons/bi";
import { HiXMark } from 'react-icons/hi2';

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

type RefeWithComp = Prisma.ReferentielGetPayload<{
    include: {
        competences: {
            include: {
                niveaux: true
            }
        }
    }
}>

type CompWithLvl = Prisma.CompetenceGetPayload<{
    include: {
        niveaux: true
    }
}>

export const getServerSideProps: GetServerSideProps<{
    referentiel: RefeWithComp
}> = async function (context) {
    const session = await getSession(context)
    const superadmin = session?.user.superadmin

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!superadmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const referentiel = await prisma.referentiel.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            competences: {
                include: {
                    niveaux: true
                }
            }
        }
    });

    if (!referentiel) {
        return {
            redirect: {
                destination: '/superadmin/referentiel',
                permanent: false,
            },
        }
    }

    return {
        props: {
            referentiel: JSON.parse(JSON.stringify(referentiel)) as RefeWithComp
        }
    }
};

const ModifierRef: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ referentiel }) => {
    const updateRef = api.referentiel.update.useMutation()

    const createCompetence = api.competence.create.useMutation()
    const deleteCompetence = api.competence.delete.useMutation()
    //const updateCompetence = api.competence.update.useMutation()

    const addLvl = api.niveau.create.useMutation()
    //const updateLvl = api.niveau.update.useMutation()

    const [selectedComp, setComp] = useState(() => {
        if (referentiel.competences.length > 0) {
            return referentiel.competences[0]
        }
        else {
            return null
        }
    })

    const [selectedLvl, setLvl] = useState(() => {
        if (referentiel.competences.length > 0) {
            if (referentiel.competences[0]!.niveaux.length > 0) {
                return referentiel.competences[0]!.niveaux[1]
            }
        }
        else {
            return null
        }
    })

    const [tab, setTab] = useState("normal")

    const [index, setIndex] = useState(1)

    const [n1TODO, setTODO1] = useState("")
    const [n1Eval, setEval1] = useState("")

    const [n2TODO, setTODO2] = useState("")
    const [n2Eval, setEval2] = useState("")

    const [n3TODO, setTODO3] = useState("")
    const [n3Eval, setEval3] = useState("")

    async function handleCompetence(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            compTitle: { value: string };
        };
        if (n1TODO === "" || n1Eval === "" || n2Eval === "" || n2TODO === "" || n3Eval === "" || n3TODO === "") {
            alert('Merci de remplir tout les champs')
        }
        else {
            const temp = await createCompetence.mutateAsync({ title: target.compTitle.value, idR: referentiel.id })
            await addLvl.mutateAsync({ title: "Niveau 1", idC: temp.id, todo: n1TODO, eval: n1Eval })
            await addLvl.mutateAsync({ title: "Niveau 2", idC: temp.id, todo: n2TODO, eval: n2Eval })
            await addLvl.mutateAsync({ title: "Niveau 3", idC: temp.id, todo: n3TODO, eval: n3Eval })
            window.location.reload()
        }
    }

    async function handleTitle(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            refTitle: { value: string };
        };
        await updateRef.mutateAsync({ id: referentiel.id, title: target.refTitle.value })
        window.location.reload()
    }

    async function handleDelComp(e: React.SyntheticEvent) {
        e.preventDefault()
        await deleteCompetence.mutateAsync({ id: selectedComp!.id })
        window.location.reload()
    }

    /*async function modifComp(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            compTitle: { value: string };
        };
        if (n1TODO === "" || n1Eval === "" || n2Eval === "" || n2TODO === "" || n3Eval === "" || n3TODO === "") {
            alert('Merci de remplir tout les champs')
        }
        else {
            if (selectedComp?.niveaux[0] && selectedComp?.niveaux[1] && selectedComp?.niveaux[2]) {
                await updateLvl.mutateAsync({ id: selectedComp.niveaux[0].id, todo: n1TODO, eval: n1Eval })
                await updateLvl.mutateAsync({ id: selectedComp.niveaux[1].id, todo: n2TODO, eval: n2Eval })
                await updateLvl.mutateAsync({ id: selectedComp.niveaux[2].id, todo: n3TODO, eval: n3Eval })
                window.location.reload()
            }
            else{
                alert(`La compétence n'existe pas`)
            }
            
        }

    }*/

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">

                <h1 className="text-4xl font-extrabold text-black w-full">Gestion de <i>{referentiel.title}</i></h1>

                <form onSubmit={() => handleTitle} className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl" method="POST">
                    <label htmlFor="refTitle" className="text-2xl text-black w-full">Nom du référetiel</label>
                    <input
                        type='text'
                        name="refTitle"
                        id="refTitle"
                        className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_3px_6px_12px_4px_rgba(0,0,0,0.25)] w-full"
                        autoComplete="off"
                        placeholder="Titre du référentiel"
                        defaultValue={referentiel.title}
                    />

                    <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-lg" type="submit">
                        Valider le titre
                    </button>
                </form>

                <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl">

                    <div className="flex w-full items-start justify-start bg-white gap-5">

                        <aside className=" flex flex-col gap-5 border-2 border-[#f3f3f3] rounded-xl py-5 px-5 w-3/12">
                            <h2 className="text-2xl text-[#0e6073] font-bold w-full">Compétences</h2>
                            {referentiel.competences as CompWithLvl[] && referentiel.competences.length > 0 && referentiel.competences.map((competence) => {
                                return (
                                    <button
                                        className={`flex w-full gap-5 px-2 ${selectedComp && selectedComp.id === competence.id ? 'bg-[#f3f3f3] py-3 rounded-md' : ''}`}
                                        key={competence.id}
                                        onClick={() => { setComp(competence), setLvl(competence.niveaux[0]) }}
                                    >
                                        {competence.title}
                                    </button>
                                )
                            })}
                        </aside>

                        <aside className="flex flex-col w-9/12">
                            <div className="flex w-full justify-between gap-1">
                                {selectedComp && selectedComp.niveaux.map((niveau, index) => {
                                    return (
                                        <button className={`flex flex-col gap-3 text-md text-black w-4/12 justify-center items-center rounded-t-xl py-2 border-[#f3f3f3] ${selectedLvl && selectedLvl.id === niveau.id ? 'bg-white border-t-2 border-l-2 border-r-2' : 'bg-[#f3f3f3] border-0'}`} onClick={() => setLvl(selectedComp.niveaux[index])} key={niveau.id}>
                                            {niveau.title}
                                        </button>
                                    )
                                })}
                            </div>

                            {selectedLvl &&
                                <div className="flex flex-col gap-5 w-full border-[#f3f3f3] border-b-2 border-l-2 border-r-2 px-5 py-3 rounded-b-xl">
                                    <span className="flex justify-between w-full">
                                        <h3 className="text-xl text-[#0e6073] w-full font-bold">{selectedComp?.title}</h3>
                                        <span className="flex flex-row justify-center">
                                            <BiPencil className="text-3xl text-[#2EA3A5] mx-2 hover:cursor-pointer" onClick={() => setTab("modif")} />
                                            <BiTrash className="text-3xl text-[#A10000] mx-2 hover:cursor-pointer" onClick={() => handleDelComp} />
                                        </span>
                                    </span>
                                    <div className="flex gap-5 w-full">
                                        <div className="max-h-[300px] overflow-y-auto w-[50%] bg-[#0e6073]/10 rounded-xl px-6 py-3 flex flex-col gap-3">
                                            <h3 className="text-xl text-[#0e6073] w-full font-bold">TODO</h3>
                                            <div dangerouslySetInnerHTML={{ __html: selectedLvl.todo }} />
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto w-[50%] bg-[#0e6073]/10 rounded-xl px-6 py-3 flex flex-col gap-3">
                                            <h3 className="text-xl text-[#0e6073] w-full font-bold">Critères d&apos;évaluations</h3>
                                            <div dangerouslySetInnerHTML={{ __html: selectedLvl.eval }} />
                                        </div>
                                    </div>

                                </div>}
                        </aside>

                    </div>
                </section>

                <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl">

                    <form onSubmit={() => handleCompetence} className="flex w-full flex-col items-center justify-start bg-white gap-5 rounded-xl" method="POST">
                        <h2 className="text-2xl text-black w-full">Ajouter une compétence</h2>
                        <input
                            type='text'
                            name="compTitle"
                            className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_0px_2px_9px_4px_rgba(0,0,0,0.25)] w-full"
                            autoComplete="off"
                            placeholder="Titre de la compétence"
                            required
                        />
                        <fieldset className="w-full flex flex-col border-2 border-[#f3f3f3] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 1</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-full max-w-[475px] h-[250px]" onChange={setTODO1} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-white w-full max-w-[475px] max-w-[50%] h-[250px]" onChange={setEval1} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <fieldset className="w-full flex flex-col border-2 border-[#f3f3f3] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 2</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-full max-w-[475px] h-[250px]" onChange={setTODO2} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-whitew-full max-w-[475px] h-[250px]" onChange={setEval2} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <fieldset className="w-full flex flex-col border-2 border-[#f3f3f3] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 3</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-full max-w-[475px] h-[250px]" onChange={setTODO3} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-white w-full max-w-[475px] h-[250px]" onChange={setEval3} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <button type="submit" className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-lg">
                            Ajouter la compétence
                        </button>

                    </form>
                </section>

                <NavBar />
                {tab === "modif" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-xl p-16 w-10/12 text-[#041f25]" method="POST">

                            <button
                                onClick={() =>
                                    setTab('normal')
                                }
                                className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500">
                                <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                            </button>
                            <label htmlFor="compTitle" className="text-2xl text-black w-full">Titre de la compétence</label>
                            <input
                                type='text'
                                name="compTitle"
                                id="compTitle"
                                className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_3px_6px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                autoComplete="off"
                                placeholder="Titre de la compétence"
                                defaultValue={selectedComp!.title}
                            />

                            <div className="flex w-full items-start justify-start bg-white gap-5">

                                <aside className="flex flex-col w-full">
                                    <div className="flex w-full justify-between gap-1">
                                        {selectedComp && selectedComp.niveaux.map((niveau, index) => {
                                            return (
                                                <div
                                                    className={`hover:cursor-pointer flex flex-col gap-3 text-md text-black w-4/12 justify-center items-center rounded-t-xl py-2 border-[#f3f3f3] ${selectedLvl && selectedLvl.id === niveau.id ? 'bg-white border-t-2 border-l-2 border-r-2' : 'bg-[#f3f3f3] border-0'}`}
                                                    onClick={() => (setLvl(selectedComp.niveaux[index]), setIndex(index))}
                                                    key={niveau.id}
                                                >
                                                    {niveau.title}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {selectedLvl &&
                                        <div className="flex flex-col gap-5 w-full border-[#f3f3f3] border-b-2 border-l-2 border-r-2 px-5 py-3 rounded-b-xl">
                                            <span className="flex justify-between w-full">
                                                <h3 className="text-xl text-[#0e6073] w-full font-bold">{selectedComp?.title}</h3>
                                                <span className="flex flex-row justify-center">
                                                    <BiPencil className="text-3xl text-[#2EA3A5] mx-2 hover:cursor-pointer" onClick={() => setTab("modif")} />
                                                    <BiTrash className="text-3xl text-[#A10000] mx-2 hover:cursor-pointer" onClick={() => handleDelComp} />
                                                </span>
                                            </span>
                                            <div className="flex gap-5 w-full">
                                                <QuillNoSSRWrapper
                                                    modules={modules}
                                                    className="bg-[#0e6073]/10 max-h-[300px] w-[50%] pb-10"
                                                    value={selectedLvl.todo}
                                                    onChange={() => {
                                                        switch (index) {
                                                            case 0:
                                                                setTODO1;
                                                                break;
                                                            case 1:
                                                                setTODO2;
                                                                break;
                                                            case 2:
                                                                setTODO3;
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }} />
                                                <QuillNoSSRWrapper
                                                    modules={modules}
                                                    className="bg-[#0e6073]/10 max-h-[300px] w-[50%] pb-10"
                                                    value={selectedLvl.eval}
                                                    onChange={() => {
                                                        switch (index) {
                                                            case 0:
                                                                setEval1;
                                                                break;
                                                            case 1:
                                                                setEval2;
                                                                break;
                                                            case 2:
                                                                setEval3;
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }} />
                                            </div>

                                        </div>}
                                </aside>

                            </div>


                            <button type="submit" className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/80 hover:cursor-pointer text-center"><p>Enregistrer les modifications</p></button>

                        </form>
                    </div>}
            </main>
        </>
    );
};

export default ModifierRef;