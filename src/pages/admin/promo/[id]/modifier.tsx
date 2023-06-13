/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import { NavBar, Notifs, Promos } from "~/components/barrel";

import { prisma } from '~/server/db';
import { Promo, type Referentiel } from '@prisma/client';
import dynamic from 'next/dynamic';
import { api } from '~/utils/api';
import Router from 'next/router';

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
    promo: Promo
}> = async function (context) {
    const session = await getSession(context)
    const admin = session?.formateur
    const superadmin = session?.superadmin

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!superadmin || !admin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const promo = await prisma.promo.findUnique({
        where: {
            id: context.query.id as string
        }
    })

    if (!promo) {
        return {
            redirect: {
                destination: '/admin/promo',
                permanent: false,
            },
        }
    }

    return {
        props: {
            promo: JSON.parse(JSON.stringify(promo)) as Promo
        }
    }
};

const ModfiPromo: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ promo }) => {
    const [description, setDesc] = useState(promo.description)
    const [image, setImage] = useState(promo.image)

    const modif = api.promo.update.useMutation()
    const { update } = useSession();

    async function handleCrea(e: React.SyntheticEvent) {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            promoTitle: { value: string };
            promoDateStart: { value: string };
            promoDateEnd: { value: string };
            imgPromo: { value: string };
        };
        const title = target.promoTitle.value
        const dateStart = new Date(target.promoDateStart.value)
        const dateEnd = new Date(target.promoDateEnd.value)
        const img = target.imgPromo.value
        const temp = await modif.mutateAsync({ id: promo.id, title: title, desc: description, img: img, start: dateStart, end: dateEnd })
        await update({ promo: temp })
        await Router.push(`/admin/promo/${temp.id}`)
    }

    return (
        <>
            <Head>
                <title>OktoBrief</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen min-w-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px] pt-[40px] gap-7">

                <h1 className="text-4xl font-extrabold text-black w-full px-[10%]">Modifier <i>{promo.title}</i></h1>

                <form onSubmit={(e) => void handleCrea(e)} className="flex h-full w-full flex-col items-center px-[10%] gap-3" method='POST'>

                    <div className="flex h-[80%] w-full flex justify-between">

                        <fieldset className="bg-white h-full w-[59%] p-5 flex flex-col gap-3 rounded-lg">
                            <p className="text-[#A10000]">* Obligatoire</p>

                            <fieldset>
                                <label htmlFor='promoTitle'>Titre de la promo<span className="text-[#A10000]">*</span></label>
                                <input
                                    type='text'
                                    name="promoTitle"
                                    id="promoTitle"
                                    className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                    autoComplete="off"
                                    required
                                    defaultValue={promo.title}
                                />
                            </fieldset>

                            <fieldset>
                                <p>Description de la promo<span className="text-[#A10000]">*</span></p>
                                <QuillNoSSRWrapper
                                    theme="snow"
                                    placeholder="Description de la promo"
                                    className="pb-11 bg-white w-full h-[200px]"
                                    modules={modules}
                                    onChange={(e) => setDesc(e)}
                                    defaultValue={promo.description}
                                />
                            </fieldset>

                        </fieldset>

                        <fieldset className="bg-white h-full w-[40%] p-5 flex flex-col gap-3 pt-9 rounded-lg items-center">
                            <fieldset className='w-full'>
                                <label htmlFor='promoDateStart'>Date de début<span className="text-[#A10000]">*</span></label>

                                <input
                                    type='date'
                                    name="promoDateStart"
                                    id="promoDateStart"
                                    placeholder="01/01/2023"
                                    className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                    autoComplete="off"
                                    required
                                    defaultValue={promo.starting.toString().slice(0, 10)}
                                />
                            </fieldset>

                            <fieldset className='w-full'>
                                <label htmlFor='promoDateEnd'>Date de fin<span className="text-[#A10000]">*</span></label>
                                <input
                                    type='date'
                                    name="promoDateEnd"
                                    id="promoDateEnd"
                                    placeholder="01/01/2023"
                                    className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                    autoComplete="off"
                                    required
                                    defaultValue={promo.ending.toString().slice(0, 10)}
                                />
                            </fieldset>

                            <fieldset className='w-full'>
                                <label htmlFor='imgPromo'>Image de la promo</label>
                                <input
                                    type='url'
                                    name='imgPromo'
                                    id='imgPromo'
                                    className="px-[1rem] py-3 w-full rounded-lg shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                    placeholder="url de l'image"
                                    autoComplete='off'
                                    defaultValue={promo.image}
                                    onChange={(e)=> setImage(e.target.value)}
                                />
                            </fieldset>
                            <img className="max-w-full max-h-[200px] " src={image}/>

                        </fieldset>
                    </div>

                    <button type='submit' className="flex flex-row items-center justify-between px-5 py-4 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg self-end">
                        Enregistrer les modifications
                    </button>
                </form>

                <Notifs />
                <NavBar />
            </main>
        </>
    );
};

export default ModfiPromo;