import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { BiGroup, BiCalendar, BiPencil, BiTrash, BiSearch, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { NavBar, Notifs, Promos } from "../components/barrel";
import Link from "next/link";
import { prisma } from "~/server/db";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import Image from "next/image";
import React, { useState } from "react";
import type { BriefWithAll, PromoWithAll } from "~/utils/type";
import { aleatoirePP } from "~/utils/genertor";

export const getServerSideProps: GetServerSideProps<{
  briefs: BriefWithAll[],
  promos: PromoWithAll[]
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

  let promos = await prisma.promo.findMany({
    where: {
      apprenants: {
        some: {
          id: session.user.id
        }
      }
    },
    include: {
      apprenants: true,
      referentiel: true
    }
  });

  if (session.superadmin) {
    promos = await prisma.promo.findMany({
      include: {
        apprenants: true,
        referentiel: true
      }
    })
  }

  if(session.promo === undefined ){
    return {
      redirect: {
        destination: '/oops',
        permanent: false,
      },
    }
  }

  const briefs = await prisma.brief.findMany({
    where: {
      assignations: {
        some: {
          idUser: session.user.id,
          idPromo: session.promo.id
        }
      },
    },
    include: {
      formateur: true
    }
  })

  return {
    props: {
      briefs: JSON.parse(JSON.stringify(briefs)) as BriefWithAll[],
      promos: JSON.parse(JSON.stringify(promos)) as PromoWithAll[]
    }
  }
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ briefs, promos }) => {
  const { data: sessionData } = useSession()

  const [tab, setTab] = useState("normal")
  const [selectedCat, setSelectedCat] = useState(0)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [modifyTag, setModifyTag] = useState(0)
  const [modifyCat, setModifyCat] = useState(0)
  const [creating, setCreating] = useState("")
  const [SearchTerm, setSearchTerm] = useState('');

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const pp = aleatoirePP();
  let briefIlu = "/promo.jpeg";

  const CATEGORIES = [
    {
      "id": 1,
      "title": "CMS",
      "tags": [
        {
          "id": 1,
          "title": "Big data"

        },
        {
          "id": 2,
          "title": "Algorithmique"
        },
        {
          "id": 3,
          "title": "SQL"
        }
      ]
    },
    {
      "id": 2,
      "title": "Data",
      "tags": [
        {
          "id": 4,
          "title": "Algorithmique"
        },
        {
          "id": 5,
          "title": "Big data"
        },
        {
          "id": 6,
          "title": "SQL"
        }
      ]
    },
    {
      "id": 3,
      "title": "Cybersécurité",
      "tags": [
        {
          "id": 7,
          "title": "SQL"
        },
        {
          "id": 8,
          "title": "Big data"

        },
        {
          "id": 9,
          "title": "SQL"

        },
        {
          "id": 10,
          "title": "Algorithmique"
        }
      ]
    },
    {
      "id": 4,
      "title": "Data",
      "tags": [
        {
          "id": 11,
          "title": "Algorithmique"
        },
        {
          "id": 12,
          "title": "Big data"
        },
        {
          "id": 13,
          "title": "SQL"
        }
      ]
    },
    {
      "id": 5,
      "title": "Cybersécurité",
      "tags": [
        {
          "id": 14,
          "title": "Big data"

        },
        {
          "id": 15,
          "title": "SQL"

        },
        {
          "id": 16,
          "title": "Algorithmique"
        }
      ]
    },
    {
      "id": 6,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 7,
      "title": "Data",
      "tags": []
    },
    {
      "id": 8,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 9,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 10,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 11,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 12,
      "title": "CMS",
      "tags": []
    },
    {
      "id": 13,
      "title": "CMS",
      "tags": []
    },
  ];

  function removeTag(tab: number[], item: number) {
    const index = tab.indexOf(item);

    tab.splice(index, 1);

    return (tab)
  }

  const data = [
    {
      name: 'n 1',
      val: 20
    },
    {
      name: 'n 2',
      val: 50
    },
    {
      name: 'n 3',
      val: 100
    }
  ];

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>

      <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">

        <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
          <span className="flex w-full flex-row items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-black">Votre dashboard</h1>
            <Promos promos={promos} />
          </span>

          <section className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Ma promo</h2>
              {sessionData && sessionData.promo && sessionData.superadmin &&
                <Link href={`/admin/promo/${sessionData?.promo.id}/modifier`} className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                  Modifier
                </Link>
              }
            </span>

            <div className="flex w-full flex-row items-center">
              {sessionData && sessionData.promo && sessionData.promo.image !== "" && <Image width={900} height={900} loader={() => sessionData.promo.image} src={sessionData.promo.image} className="w-[55%] max-h-[300px] bg-center bg-cover mr-5 object-cover" alt="Image de la promo sélectionnée" />}
              <div className="w-[45%]">
                <h3 className="text-xl text-black mb-2">{sessionData?.promo.title}</h3>
                {sessionData && sessionData.promo && sessionData.promo.description && <div className="text-sm mb-5" dangerouslySetInnerHTML={{ __html: sessionData.promo.description }} />}
                <span className="flex w-full flex-row items-center justify-between">
                  <span className="flex w-full flex-row items-center">
                    <BiGroup className="text-4xl text-[#0E6073] mr-1" />
                    <p>{sessionData && sessionData.promo && sessionData?.promo.apprenants ? sessionData.promo.apprenants.length : "0"} apprenants</p>
                  </span>
                  <span className="flex w-full flex-row items-center">
                    <BiCalendar className="text-4xl text-[#0E6073] mr-1" />
                    <p>Du 04/01/2022 au 10/09/2023</p>
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/*<section className="flex flex-col justify-start items-start w-full mb-5">
            <h2 className="text-2xl text-black ml-5 mb-5">Les projets de la promo</h2>
            <div className="flex flex-row overflow-x-auto max-w-full pb-2">
              <div className="flex flex-col justify-start bg-white p-5 pb-0 rounded-lg w-full mx-2">
                <p>Lorem ipsum</p>
                <ResponsiveContainer width={300} height={200}>
                    <BarChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        layout="vertical"
                        barCategoryGap="20%"
                        barGap={1}
                        maxBarSize={20}
                        width={300}
                        height={200}
                        radius={[10, 10, 10, 10]}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tick={false}
                            strokeWidth={0.5}
                        />
                        <YAxis
                            axisLine={false}
                            type="category"
                            tickLine={false}
                            dataKey="name"
                            width={40}
                        />
                        <Bar dataKey="val" fill="#2EA3A5" background={{ fill: '#EAEAEA', radius:[10, 10, 10, 10] }} radius={[10, 10, 10, 10]}/>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-start bg-white p-5 pb-0 rounded-lg w-full mx-2">
                <p>Lorem ipsum</p>
                  <ResponsiveContainer width={300} height={200}>
                    <BarChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        layout="vertical"
                        barCategoryGap="20%"
                        barGap={2}
                        maxBarSize={20}
                        width={300}
                        height={200}
                        radius={[10, 10, 10, 10]}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tick={false}
                            strokeWidth={0.5}
                        />
                        <YAxis
                            axisLine={false}
                            type="category"
                            tickLine={false}
                            dataKey="name"
                            width={40}
                        />
                        <Bar dataKey="val" fill="#2EA3A5" background={{ fill: '#EAEAEA', radius:[10, 10, 10, 10] }} radius={[10, 10, 10, 10]}/>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-start bg-white p-5 pb-0 rounded-lg w-full mx-2">
                <p>Lorem ipsum</p>
                  <ResponsiveContainer width={300} height={200}>
                    <BarChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        layout="vertical"
                        barCategoryGap="20%"
                        barGap={2}
                        maxBarSize={20}
                        width={300}
                        height={200}
                        radius={[10, 10, 10, 10]}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tick={false}
                            strokeWidth={0.5}
                        />
                        <YAxis
                            axisLine={false}
                            type="category"
                            tickLine={false}
                            dataKey="name"
                            width={40}
                        />
                        <Bar dataKey="val" fill="#2EA3A5" background={{ fill: '#EAEAEA', radius:[10, 10, 10, 10] }} radius={[10, 10, 10, 10]}/>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-start bg-white p-5 pb-0 rounded-lg w-full mx-2">
                <p>Lorem ipsum</p>
                  <ResponsiveContainer width={300} height={200}>
                    <BarChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                        layout="vertical"
                        barCategoryGap="20%"
                        barGap={2}
                        maxBarSize={20}
                        width={300}
                        height={200}
                        radius={[10, 10, 10, 10]}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tick={false}
                            strokeWidth={0.5}
                        />
                        <YAxis
                            axisLine={false}
                            type="category"
                            tickLine={false}
                            dataKey="name"
                            width={40}
                        />
                        <Bar dataKey="val" fill="#2EA3A5" background={{ fill: '#EAEAEA', radius:[10, 10, 10, 10] }} radius={[10, 10, 10, 10]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
                  </section>*/}

          <section className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les projets de la promo</h2>
              <span className="flex flex-row items-center justify-end w-[50%]">
                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center mr-2">
                  <BiSearch className="text-3xl text-black ml-4" />
                  <input
                    type='text'
                    name="searchProject"
                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                    autoComplete="off"
                  />
                </div>
                {(sessionData?.superadmin || sessionData?.formateur) && <Link href={"/admin/briefs/creer"} className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base">
                  Créer un projet
                </Link>}
              </span>
            </span>
            <div className="flex flex-row justify-between w-full">
              {briefs && briefs.length > 0 && briefs.map((item) => {

                let pp = aleatoirePP();
                if (item.formateur.image) {
                  pp = item.formateur.image
                }

                let briefIlu = "/promo.jpeg";
                if (item.img) {
                  briefIlu = item.img
                }

                return (
                  <>
                    <Link className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" href={""}>
                      <Image width={200} height={200} loader={() => briefIlu} src={briefIlu} className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                      <div className="m-5 text-start">
                        <h3 className="text-lg text-black">{item.title}</h3>
                        <p className="text-sm text-black">{item.desc}</p>
                        <span className="flex flex-row justify-end items-center w-full mt-5">
                          <Image width={200} height={200} loader={() => pp} src={pp} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                          <p className="text-sm text-black">{item.formateur.name}</p>
                        </span>
                      </div>
                    </Link>
                  </>
                )
              })}
            </div>
          </section>
          <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h1 className="text-4xl font-semibold text-black">Ressources du projet</h1>
              <div className="flex flex-row justify-end w-[50%]">
                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[60%] min-w-[200px] max-w-[450px] flex flex-row justify-between items-center mr-2">
                  <BiSearch className="text-3xl text-black ml-4" />
                  <input
                    type='text'
                    name="searchProject"
                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                    autoComplete="off"
                  />
                </div>
              </div>
            </span>
            <div className="flex flex-col w-full gap-3">
              <div className="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-row justify-between items-center w-full pl-5 h-[230px]">
                <div className="w-[50%] flex flex-col items-start my-5">
                  <h2 className="text-2xl text-black">Ressource 1</h2>
                  <p className="text-sm text-start">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                  <span className="flex flex-row justify-start items-center w-full mt-5">
                    <Image width={300} height={300} loader={() => pp} src={pp} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                    <p className="text-sm text-black">Lorem Ipsum</p>
                  </span>
                </div>
                <div className="w-[25%] h-full flex flex-col items-center justify-start my-5 py-5">
                  <span className="flex flex-row justify-around self-end items-center w-24 mb-5">
                    <button>
                      <BiPencil className="text-3xl text-[#2EA3A5]" />
                    </button>
                    <button>
                      <BiTrash className="text-3xl text-[#A10000]" />
                    </button>
                  </span>
                  <div className=" w-full grid grid-cols-2 gap-2 content-stretch">
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">WordPress</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">JavaScript</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">Drupal</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">Modélisation POO</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">WordPress</p>
                    </div>
                  </div>
                </div>
                <Image width={1000} height={1500} loader={() => briefIlu} src={briefIlu} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la promo sélectionnée" />
              </div>

              <div className="bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-row justify-between items-center w-full pl-5 h-[230px]">
                <div className="w-[50%] flex flex-col items-start my-5">
                  <h2 className="text-2xl text-black">Ressource 1</h2>
                  <p className="text-sm text-start">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                  <span className="flex flex-row justify-start items-center w-full mt-5">
                    <Image width={300} height={300} loader={() => pp} src={pp} className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                    <p className="text-sm text-black">Lorem Ipsum</p>
                  </span>
                </div>
                <div className="w-[25%] h-full flex flex-col items-center justify-start my-5 py-5">
                  <span className="flex flex-row justify-around self-end items-center w-24 mb-5">
                    <button>
                      <BiPencil className="text-3xl text-[#2EA3A5]" />
                    </button>
                    <button>
                      <BiTrash className="text-3xl text-[#A10000]" />
                    </button>
                  </span>
                  <div className=" w-full grid grid-cols-2 gap-2 content-stretch">
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">WordPress</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">WordPress</p>
                    </div>
                    <div className="flex flex-row justify-center items-center text-center bg-[#EDEDED] px-4 py-2 rounded-full">
                      <p className="text-sm">WordPress</p>
                    </div>
                  </div>
                </div>
                <Image width={1000} height={1500} loader={() => briefIlu} src={briefIlu} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la promo sélectionnée" />
              </div>
            </div>
          </section>

        </div>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default Home;