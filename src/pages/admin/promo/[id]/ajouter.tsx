import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { NavBar, Notifs } from "~/components/barrel";

import { api } from "~/utils/api";
import { type Prisma } from "@prisma/client";
import { prisma } from "~/server/db";
import React from "react";

type UserWithAll = Prisma.UserGetPayload<{
  include: { promos: true, assignations: true }
}>

type PromoWithStudent = Prisma.PromoGetPayload<{
  include: {
    apprenants: {
      include: {
        promos: true,
        assignations: true
      }
    }
  }
}>
import Image from "next/image";

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
  const { data: user } = api.user.getApprenants.useQuery()


  async function handleAdd(e: React.SyntheticEvent){
    e.preventDefault()
    await console.log("test")

  }

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen min-w-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
        <div className="flex min-h-screen h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
          <div className="flex flex-row h-[90%] w-full flex flex-row justify-between">
            <div className="bg-white h-full w-[59%] p-5 flex flex-col justify-between">
              <h2 className="text-2xl text-black">Ajouter des apprenants</h2>
              <div>
                <span className="flex flex-row">
                  <p>Adresse email</p>
                  <p className="text-[#A10000]">*</p>
                </span>
                <input
                  type='text'
                  name="studentEmail"
                  className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                  autoComplete="off"
                />
                <span className="flex flex-row mt-10">
                  <p>Prénom</p>
                  <p className="text-[#A10000]">*</p>
                </span>
                <input
                  type='text'
                  name="studentName"
                  className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                  autoComplete="off"
                />
                <span className="flex flex-row mt-10">
                  <p>Nom</p>
                  <p className="text-[#A10000]">*</p>
                </span>
                <input
                  type='text'
                  name="studentLastName"
                  className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                  autoComplete="off"
                />
              </div>
              <button className="bg-[#0E6073] self-end py-2 px-7 text-white rounded-lg">Ajouter</button>
            </div>


            <div className="bg-white h-full w-[40%] p-5 overflow-auto">
              {promo.apprenants && promo.apprenants as UserWithAll[] && promo.apprenants.length > 0 && promo.apprenants.map((item) => {
                return (
                  <span className="flex flex-row justify-between items-center w-full mt-5" key={item.id}>
                    <div className="flex flex-row items-center">
                      <button className="flex flex-row items-center justify-center w-6 h-6 bg-[#D9D9D9] rounded-full mr-2">
                        <p className="text-[#0E6073]">-</p>
                      </button>
                      {item.image && (item.image.includes("http://") || item.image.includes("https://")) ? <img src={item.image} className="w-12 h-12 rounded-full object-cover mr-3" alt={item.name ? item.name : ""} /> : <img src="/Kristen.png" className="w-12 h-12 rounded-full object-cover mr-3" alt={item.name ? item.name : ""} />}
                      <p className="text-base text-black font-semibold">{item.name}</p>
                    </div>
                    <p className="text-xs text-[#8C8C8C] mr-1">{item.email}</p>
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default AddApprenants;