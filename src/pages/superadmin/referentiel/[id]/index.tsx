import { type GetServerSideProps, type InferGetServerSidePropsType, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { NavBar } from "~/components/barrel";
import { prisma } from "~/server/db";
import { useState } from "react";
import Router from "next/router";
import { BiPencil, BiTrash } from "react-icons/bi";
import { api } from "~/utils/api";
import { RefeWithComp, CompWithLvl } from "~/utils/type";


export const getServerSideProps: GetServerSideProps<{
    referentiel: RefeWithComp
}> = async function (context) {
    const session = await getSession(context)
    const superadmin = session?.superadmin

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
                destination: '/superadmin',
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

const IndexRef: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ referentiel }) => {
    const delRef = api.referentiel.delete.useMutation()

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
                return referentiel.competences[0]!.niveaux[0]
            }
        }
        else {
            return null
        }
    })

    async function handleDelete(e: React.SyntheticEvent) {
        e.preventDefault()
        await delRef.mutateAsync({ id: referentiel.id })
        window.location.reload()
    }

    async function goToModif(e: React.SyntheticEvent) {
        e.preventDefault()
        await Router.push(`/superadmin/referentiel/${referentiel.id}/modifier`)
    }

    return (
        <>
            <Head>
                <title>Référentiel</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] pl-[150px] px-[50px] pt-10 gap-5">
                <span className="w-full flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-black">
                        Référentiel <i>{referentiel.title}</i>
                    </h1>
                    <span className="flex gap-2">
                        <BiPencil className="text-4xl text-[#2EA3A5] hover:cursor-pointer" onClick={() => goToModif} />
                        <BiTrash className="text-4xl text-[#A10000] hover:cursor-pointer" onClick={() => handleDelete} />
                    </span>
                </span>

                <section className="flex w-full flex-col items-center justify-start bg-white px-[40px] py-[40px] gap-5 rounded-xl">
                    <div className="flex w-full items-start justify-start bg-white gap-5">

                        <aside className=" flex flex-col gap-2 border-2 border-[#f3f3f3] rounded-xl py-5 px-5 w-3/12 max-h-[420px] overflow-y-auto">
                            <h2 className="text-2xl text-[#0e6073] font-bold w-full mb-2">Compétences</h2>
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
                                        <button
                                            className={`flex flex-col gap-3 text-md text-black w-4/12 justify-center items-center rounded-t-xl py-2 border-[#f3f3f3] ${selectedLvl && selectedLvl.id === niveau.id ? 'bg-white border-t-2 border-l-2 border-r-2' : 'bg-[#f3f3f3] border-0'}`}
                                            onClick={() => setLvl(selectedComp.niveaux[index])}
                                            key={niveau.id}
                                        >
                                            {niveau.title}
                                        </button>
                                    )
                                })}
                            </div>

                            {selectedLvl &&
                                <div className="flex flex-col gap-5 w-full border-[#f3f3f3] border-b-2 border-l-2 border-r-2 px-5 py-5 rounded-b-xl pb-[16px]">
                                    <h3 className="text-xl text-[#0e6073] w-full font-bold">{selectedComp?.title}</h3>
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

                <NavBar />
            </main>
        </>
    );
};

export default IndexRef;