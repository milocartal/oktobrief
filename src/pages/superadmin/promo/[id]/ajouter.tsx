import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { NavBar, Notifs } from "~/components/barrel";

import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import React from "react";
import type { PromoWithStudent, UserWithAll } from "~/utils/type";
import { aleatoirePP } from "~/utils/genertor";

import Image from "next/image";
import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";

export const getServerSideProps: GetServerSideProps<{
  promo: PromoWithStudent
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

  const promo = await prisma.promo.findUnique({
    where: {
      id: context.query.id as string
    },
    include: {
      apprenants: {
        include: {
          promos: true,
          assignations: true
        }
      }
    }
  })

  return {
    props: {
      promo: JSON.parse(JSON.stringify(promo)) as PromoWithStudent
    }
  }
};

const AddApprenants: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ promo }) => {

  const findUser = api.user.find.useMutation()
  const createUser = api.user.create.useMutation()

  const addStudent = api.promo.addStudent.useMutation()

  async function handleAdd(e: React.SyntheticEvent) {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      studentEmail: { value: string };
      studentName: { value: string };
      studentLastName: { value: string };
    };
    const mail = target.studentEmail.value
    const name = target.studentLastName.value
    const firstname = target.studentName.value
    const temp = await findUser.mutateAsync({ email: mail })
    if (!temp) {
      const newUser = await createUser.mutateAsync({ firstname: firstname, name: name, email: mail })
      await addStudent.mutateAsync({ id: promo.id, idU: newUser.id })
      window.location.reload()
    }
    else {
      await addStudent.mutateAsync({ id: promo.id, idU: temp.id })
      window.location.reload()
    }
  }

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#F3F3F3] h-screen min-w-screen pl-[150px] p-[50px] flex items-center jutisfy-center gap-5">

        <Link href={`/superadmin/promo/${promo.id}`} className="px-5 py-2 bg-[#0e6073] text-white rounded-lg absolute top-[40px] flex items-center justify-between gap-1"><BiLeftArrowAlt className="text-3xl" /> Retour</Link>

        <form onSubmit={(e) => void handleAdd(e)} className="bg-white rounded-xl max-h-[80%] w-[60%] py-10 px-6 flex flex-col gap-5">
          <h2 className="text-2xl text-black">Ajouter des apprenants</h2>
          <fieldset>
            <label htmlFor="studentEmail" className="flex flex-row">Adresse email<span className="text-[#A10000]">*</span></label>
            <input
              type='email'
              name="studentEmail"
              id="studentEmail"
              className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
              autoComplete="off"
              required
            />
          </fieldset>

          <fieldset>
            <label htmlFor="studentEmail" className="flex flex-row">Prénom<span className="text-[#A10000]">*</span></label>
            <input
              type='text'
              name="studentName"
              id="studentName"
              className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
              autoComplete="off"
              required
            />
          </fieldset>

          <fieldset>
            <label className="flex flex-row">Nom<span className="text-[#A10000]">*</span></label>
            <input
              type='text'
              name="studentLastName"
              id="studentLastName"
              className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
              autoComplete="off"
              required
            />
          </fieldset>

          <button type="submit" className="bg-[#0E6073] self-end py-2 px-7 text-white rounded-lg">Ajouter</button>
        </form>


        <aside className="bg-white h-[80%] w-[40%] p-5 overflow-auto rounded-xl">
          {promo.apprenants && promo.apprenants as UserWithAll[] && promo.apprenants.length > 0 && promo.apprenants.map((item) => {
            let pp = aleatoirePP()
            if (item.image !== "" && item.image !== null) {
              pp = item.image
            }
            return (
              <span className="flex flex-row justify-between items-center w-full mt-5" key={item.id}>
                <div className="flex flex-row items-center">
                  <button className="flex flex-row items-center justify-center w-6 h-6 bg-[#D9D9D9] rounded-full mr-2">
                    <p className="text-[#0E6073]">-</p>
                  </button>
                  <Image width={300} height={300} loader={() => pp} src={pp} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                  <p className="text-base text-black font-semibold">{item.firstName} {item.name}</p>
                </div>
                <p className="text-xs text-[#8C8C8C] mr-1">{item.email}</p>
              </span>
            )
          })}
        </aside>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default AddApprenants;