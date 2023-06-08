import { type InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { BiGroup, BiCalendar, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import { NavBar, Notifs, Promos } from "../components/barrel";
import Link from "next/link";
import { prisma } from "~/server/db";

import Image from "next/image";
import { useState } from "react";
import type { BriefWithAll, PromoWithAll } from "~/utils/type";

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

  let promos;

  if (session.superadmin) {
    promos = await prisma.promo.findMany()
  }
  else {
    promos = await prisma.promo.findMany({
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
    })
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


  const test = sessionData?.promo
  console.log(test)

  function removeTag(tab: number[], item: number){
    const index = tab.indexOf(item);

    tab.splice(index, 1);
    console.log(tab)

    return(tab)
  }

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
              <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg">
                Modifier
              </button>
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
                return (
                  <>
                    <Link className="flex flex-col w-[33%] max-w-[500px] rounded-lg h-[400px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" href={""}>
                      <Image width={200} height={200} src="/promo.jpeg" className="w-[100%] max-h-[200px] bg-center bg-cover mr-5 rounded-t-lg" alt="Image de la promo sélectionnée" />
                      <div className="m-5 text-start">
                        <h3 className="text-lg text-black">{item.title}</h3>
                        <p className="text-sm text-black">{item.desc}</p>
                        <span className="flex flex-row justify-end items-center w-full mt-5">
                          <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                          <p className="text-sm text-black">{item.formateur.name}</p>
                        </span>
                      </div>
                    </Link>
                  </>
                )
              })}
            </div>
          </section>

          <div className="flex w-full flex-col items-center justify-start bg-white rounded-lg px-[40px] py-[40px] mb-5">
            <span className="flex w-full flex-row items-center justify-between mb-3">
              <h2 className="text-2xl text-black">Les ressources de la promo</h2>
              <span className="flex w-[60%] flex-row items-center justify-end">
                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[50%] flex flex-row justify-between items-center mr-2">
                  <BiSearch className="text-3xl text-black ml-4" />
                  <input
                    type='text'
                    placeholder="Rechercher"
                    name="searchResources"
                    className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                    autoComplete="off"
                  />
                </div>
                <button className="flex flex-row items-center justify-between px-5 py-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg text-base text-center" onClick={() => setTab("ressource")}>
                  Ajouter une ressource
                </button>
              </span>
            </span>

            <div className="flex flex-col items-center w-full gap-5">
              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                      <p className="text-sm text-black">Lorem ipsum</p>
                    </span>
                  </div>
                  <div className="w-[30%] px-2">
                    <span className="flex flex-row justify-center">
                      <BiPencil className="text-3xl text-[#2EA3A5] mx-2" />
                      <BiTrash className="text-3xl text-[#A10000] mx-2" />
                    </span>
                    <span className="flex flex-row justify-start mt-5 w-full flex-wrap">
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">Drupal</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">JavaScript</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                    </span>

                  </div>
                </div>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée" />
              </div>

              <div className="flex flex-col w-full rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
                <div className="m-5 w-[75%] flex flex-row justify-between">
                  <div className="w-[70%]">
                    <h3 className="text-lg text-black">Ressource 1</h3>
                    <p className="text-sm text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut est nec ante dapibus pretium. Etiam eget commodo neque. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet. Nullam laoreet sagittis sapien, nec finibus dolor maximus sit amet.</p>
                    <span className="flex flex-row justify-start items-center w-full mt-5">
                      <Image width={200} height={200} src="/userPFP.png" className="w-12 h-12 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                      <p className="text-sm text-black">Lorem ipsum</p>
                    </span>
                  </div>
                  <div className="w-[30%] px-2">
                    <span className="flex flex-row justify-center">
                      <BiPencil className="text-3xl text-[#2EA3A5] mx-2" />
                      <BiTrash className="text-3xl text-[#A10000] mx-2" />
                    </span>
                    <span className="flex flex-row justify-start mt-5 w-full flex-wrap">
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">Drupal</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">JavaScript</p>
                      </div>
                      <div className="bg-[#EDEDED] px-3 py-1 w-fit rounded-full m-1">
                        <p className="text-sm">WordPress</p>
                      </div>
                    </span>

                  </div>
                </div>
                <Image width={200} height={200} src="/promo.jpeg" className="w-[20%] h-full bg-center bg-cover rounded-r-lg absolute right-0" alt="Image de la promo sélectionnée" />
              </div>
            </div>
          </div>
        </div>

        <Notifs />
        <NavBar />
        {tab === "ressource" &&
          <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
            <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-lg p-10 w-8/12 max-h-[90%] text-[#041f25]">
              <span className="flex flex-row justify-between">
                <h1 className="text-4xl font-extrabold text-black">Créer une ressource</h1>
                <p className="text-base text-[#A10000]">*Obligatoire</p>
              </span>
              <div className="w-full h-full max-h-[50%] flex flex-row justify-between items-start">
                <div className="w-[38%]">
                  <fieldset>
                    <label htmlFor='ressourceTitle'>Titre de la ressource <span className="text-[#A10000] text-1xl">*</span></label>
                    <input
                      type='text'
                      name="ressourceTitle"
                      className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-3"
                      autoComplete="off" />
                  </fieldset>
                  <fieldset>
                    <label htmlFor='ressourceDescription'>Description de la ressource <span className="text-[#A10000] text-1xl">*</span></label>
                    <textarea
                      name="ressourceDescription"
                      rows={3}
                      className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                      autoComplete="off" />
                  </fieldset>
                  <fieldset>
                    <label htmlFor='imgRessource'>Image de la ressource</label>
                    <input
                      type='url'
                      name='imgRessource'
                      id='imgRessource'
                      className="px-[1rem] py-3 w-full rounded-lg shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                      placeholder="url de l'image"
                      autoComplete='off' />
                  </fieldset>
                </div>
              
                <div className="w-[60%] h-full">
                  <fieldset>
                    <label htmlFor='ressourceUrl'>URL de la ressource <span className="text-[#A10000] text-1xl">*</span></label>
                    <input
                      type='url'
                      name="ressourceUrl"
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
                        />
                      </div>
                      {CATEGORIES.map((item) => {
                        return (
                          <>
                          {selectedCat == item.id ?
                            <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between bg-[#2EA3A5] text-white" key={item.id} onClick={() => setSelectedCat(item.id)}>
                              <p>{item.title}</p>
                              <p>({selectedTags.length})</p>
                            </button>
                            :
                            <button type="button" className="w-full py-2 px-5 text-start flex flex-row justify-between" key={item.id} onClick={() => setSelectedCat(item.id)}>
                              <p>{item.title}</p>
                              <p>({selectedTags.length})</p>  
                            </button>
                          }
                          </>
                        )
                      })}
                    </div>
                    <div className="w-[66%] h-full p-3 flex flex-row flex-wrap">
                      {CATEGORIES[selectedCat]?.tags.map((item) => {
                        return (
                          <>
                            {selectedTags.includes(item.id) ?
                              <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#2EA3A5] text-white" key={item.id} onClick={() => setSelectedTags(removeTag(selectedTags, item.id))}>{item.title}</button>
                              :
                              <button type="button" className="py-2 px-5 mr-2 my-1 text-start rounded-full bg-[#F0F0F0]" key={item.id} onClick={() => setSelectedTags([...selectedTags, item.id])}>{item.title}</button>
                            }
                          </>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <span className="self-end">
                <button onClick={() => setTab("normal")}>Annuler</button>
                <button className="bg-[#2EA3A5] hover:bg-[#288F90] text-white py-4 px-7 rounded-lg ml-10">Enregistrer modifications</button>
              </span>
            </form>
          </div>
        }
      </main>
    </>
  );
};

export default Home;