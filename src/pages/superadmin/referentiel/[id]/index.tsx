import { type NextPage } from "next";
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";

import { type Session as SessionAuth } from 'next-auth'

import NavBar from "~/pages/components/navbar";
import { useState } from "react";
import { Competence, Niveau, Prisma, Referentiel } from "@prisma/client";
import { prisma } from "~/server/db";
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

const modifierRef: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ referentiel }) => {
    const updateRef = api.referentiel.update.useMutation()

    const createCompetence = api.competence.create.useMutation()
    const addLvl = api.niveau.create.useMutation()

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


    const [n1TODO, setTODO1] = useState("")
    const [n1Eval, setEval1] = useState("")

    const [n2TODO, setTODO2] = useState("")
    const [n2Eval, setEval2] = useState("")

    const [n3TODO, setTODO3] = useState("")
    const [n3Eval, setEval3] = useState("")

    function test() {
        alert('Merci de remplir tout les champs')
    }

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

    return (
        <>
            <Head>
                <title>Gestion de OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">

                <h1 className="text-4xl font-extrabold text-black w-full">Gestion de <i>{referentiel.title}</i></h1>

                <form onSubmit={handleTitle} className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl" method="POST">
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

                    <div className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl border-2 border-[#c4c4c4]">
                        <h2 className="text-2xl text-black w-full">Compétences</h2>

                        <div className="flex w-full gap-10">
                            <aside className=" flex flex-col gap-5 border-2 border-[#c4c4c4] rounded-xl py-5 px-5 w-3/12">
                                {referentiel.competences as CompWithLvl[] && referentiel.competences.length > 0 && referentiel.competences.map((competence) => {
                                    return (<button className="flex w-full gap-5" key={competence.id} onClick={() => { setComp(competence), setLvl(competence.niveaux[0]) }}>
                                        <p>{competence.title}</p>
                                        {/*<aside className="flex flex-col gap-5 border-2 border-black rounded-xl py-5 px-5">
                                    {competence.niveaux.map((niveau) => {
                                        return (<div className="flex flex-col gap-3">
                                            <h2 className="text-md text-black">{niveau.title}</h2>
                                            <div className="flex gap-5">
                                                <div dangerouslySetInnerHTML={{ __html: niveau.todo }} className="max-h-[300px] overflow-y-auto"/>
                                                <div dangerouslySetInnerHTML={{ __html: niveau.eval }} className="max-h-[300px] overflow-y-auto"/>
                                            </div>


                                        </div>)
                                    })}
                                </aside>*/}
                                    </button>)
                                })}
                            </aside>

                            <aside className="flex flex-col gap-5 border-2 border-[#c4c4c4] rounded-xl py-5 px-5 w-9/12">
                                <div className="flex w-full justify-between">
                                    {selectedComp && selectedComp.niveaux.map((niveau, index) => {
                                        return (
                                            <button className={`flex flex-col gap-3 text-md text-black w-4/12 justify-center items-center ${selectedLvl && selectedLvl.id === niveau.id ? 'bg-white' : 'bg-[#c4c4c4]'}`} onClick={() => setLvl(selectedComp.niveaux[index])} key={niveau.id}>
                                                {niveau.title}
                                            </button>
                                        )
                                    })}
                                </div>
                                {selectedLvl &&
                                    <div className="flex gap-5 w-full">
                                        <div dangerouslySetInnerHTML={{ __html: selectedLvl.todo }} className="max-h-[300px] overflow-y-auto w-[50%]" />
                                        <div dangerouslySetInnerHTML={{ __html: selectedLvl.eval }} className="max-h-[300px] overflow-y-auto w-[50%]" />
                                    </div>}

                            </aside>
                        </div>


                    </div>

                    <form onSubmit={handleCompetence} className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl border-2 border-[#c4c4c4]" method="POST">
                        <h2 className="text-2xl text-black w-full">Ajouter une compétence</h2>
                        <input
                            type='text'
                            name="compTitle"
                            className="px-[1rem] py-3 rounded-xl bg-white shadow-[inset_0px_2px_9px_4px_rgba(0,0,0,0.25)] w-full"
                            autoComplete="off"
                            placeholder="Titre de la compétence"
                            required
                        />
                        <fieldset className="w-full flex flex-col border-2 border-[#c4c4c4] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 1</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-[475px] h-[250px]" onChange={setTODO1} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-white w-[475px] max-w-[50%] h-[250px]" onChange={setEval1} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <fieldset className="w-full flex flex-col border-2 border-[#c4c4c4] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 2</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-[475px] h-[250px]" onChange={setTODO2} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-white w-[475px] h-[250px]" onChange={setEval2} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <fieldset className="w-full flex flex-col border-2 border-[#c4c4c4] px-10 pb-10 pt-5 rounded-xl">
                            <span className="flex w-full flex-row items-center justify-between mb-3">
                                <h2 className="text-xl text-black">Niveau 3</h2>
                            </span>
                            <fieldset className="w-full flex gap-5 justify-center">
                                <QuillNoSSRWrapper theme="snow" placeholder="TODO" className="pb-11 bg-white w-[475px] h-[250px]" onChange={setTODO3} modules={modules} />
                                <QuillNoSSRWrapper theme="snow" placeholder="Critères d'évaluations" className="pb-11 bg-white w-[475px] h-[250px]" onChange={setEval3} modules={modules} />
                            </fieldset>

                        </fieldset>

                        <button type="submit" className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-lg">
                            Ajouter la compétence
                        </button>

                    </form>
                </section>

                <NavBar />
            </main>
        </>
    );
};

export default modifierRef;