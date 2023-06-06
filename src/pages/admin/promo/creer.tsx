/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import { NavBar, Notifs, Promos } from "~/components/barrel";

import { prisma } from '~/server/db';
import { type Referentiel } from '@prisma/client';
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
  referentiel: Referentiel[]
}> = async function (context) {
  const session = await getSession(context)
  const admin = session?formateur
  const superadmin = session?.superadmin

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  if(!superadmin || !admin){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const referentiel = await prisma.referentiel.findMany()

  return {
    props: {
      referentiel: JSON.parse(JSON.stringify(referentiel)) as Referentiel[]
    }
  }
};

const CreerPromo: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const [selected, setSelected] = useState<Referentiel>()
  const [description, setDesc] = useState("")
  const create = api.promo.create.useMutation()
  const {data: ref} = api.referentiel.getAll.useQuery()

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
    if (selected !== undefined) {
      const temp = await create.mutateAsync({ title: title, desc: description, idRef: selected?.id, start: dateStart, end: dateEnd, image: img })
      await Router.push(`/admin/promo/${temp.id}/ajouter`)
    }
    else {
      alert("Veuillez selectionné un référentiel")
    }
  }

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-w-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px] pt-[40px] gap-7">

        <span className="flex w-full flex-row items-center justify-between px-[10%]">
          <h1 className="text-4xl font-extrabold text-black">Nouvelle promo</h1>
          <Promos />
        </span>

        <form onSubmit={() => {handleCrea}} className="flex h-full w-full flex-col items-center px-[10%] gap-3" method='POST'>

          <div className="flex h-[80%] w-full flex justify-between">

            <fieldset className="bg-white h-full w-[59%] p-5 flex flex-col gap-3">
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
                />
              </fieldset>

              <fieldset>
                <p>Description de la promo<span className="text-[#A10000]">*</span></p>
                <QuillNoSSRWrapper
                  theme="snow"
                  placeholder="Description de la promo"
                  className="pb-11 bg-white w-full h-[200px]"
                  modules={modules}
                  onChange={() => setDesc}
                />
              </fieldset>

              <fieldset>
                <p>Référentiel<span className="text-[#A10000]">*</span></p>

                <div className='grid grid-cols-2 gap-3 overflow-y-auto max-h-[150px]'>
                  {ref && ref.map((item) => {
                    return (
                      <div className={`py-5 shadow-[inset_3px_4px_12px_0px_rgba(0,0,0,0.25)] text-center text-sm rounded-lg ${item.id === selected?.id ? 'bg-[#0E6073] text-white' : 'bg-white'} hover:cursor-pointer`} onClick={() => setSelected(item)} key={item.id}>
                        {item.title}
                      </div>

                    )
                  })}
                </div>
              </fieldset>


            </fieldset>

            <fieldset className="bg-white h-full w-[40%] p-5 flex flex-col gap-3 pt-9">
              <fieldset>
                <label htmlFor='promoDateStart'>Date de début<span className="text-[#A10000]">*</span></label>

                <input
                  type='date'
                  name="promoDateStart"
                  id="promoDateStart"
                  placeholder="01/01/2023"
                  className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full flex flex-row justify-between items-center"
                  autoComplete="off"
                  required
                />
              </fieldset>

              <fieldset>
                <label htmlFor='promoDateEnd'>Date de fin<span className="text-[#A10000]">*</span></label>
                <input
                  type='date'
                  name="promoDateEnd"
                  id="promoDateEnd"
                  placeholder="01/01/2023"
                  className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full flex flex-row justify-between items-center"
                  autoComplete="off"
                  required
                />
              </fieldset>

              <fieldset>
                <label htmlFor='imgPromo'>Image de la promo</label>
                <input
                  type='url'
                  name='imgPromo'
                  id='imgPromo'
                  className="px-[1rem] py-3 w-full rounded-lg shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                  placeholder="url de l'image"
                  autoComplete='off'  />
              </fieldset>

            </fieldset>
          </div>

          <button type='submit' className="flex flex-row items-center justify-between px-5 py-4 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg self-end">
            Enregistrer et ajouter des apprenants à la promo
          </button>
        </form>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default CreerPromo;