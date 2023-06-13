import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import { NavBar, Notifs } from "~/components/barrel";
import { BiLeftArrowAlt, BiLink, BiCheck, BiPencil, BiTrash, BiSearch } from "react-icons/bi";
import { IoChevronUpCircleSharp, IoChevronDownCircleSharp } from "react-icons/io5";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { prisma } from "~/server/db";
import type { BriefWithAll } from "~/utils/type";
import { aleatoirePP } from "~/utils/genertor";


export const getServerSideProps: GetServerSideProps<{
    brief: BriefWithAll,
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
            ressources: true,
            referentiel: true,
            tags: true,
            formateur: true
        }
    })

    return {
        props: {
            brief: JSON.parse(JSON.stringify(brief)) as BriefWithAll,
        }
    }
};

const Brief: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ brief }) => {
    const [open, setOpen] = useState(true)
    const { data: sessionData } = useSession()
    const [tab, setTab] = useState("normal")
    const [selectedCat, setSelectedCat] = useState(0)
    const [selectedTags, setSelectedTags] = useState<number[]>([])
    const [SearchTerm, setSearchTerm] = useState('');
    
    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    function removeTag(tab: number[], item: number){
        const index = tab.indexOf(item);

        tab.splice(index, 1);

        return(tab)
    }

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

    const pp = aleatoirePP();
    let briefIlu = "/promo.jpeg";
    if (brief.img) {
        briefIlu = brief.img
    }

    return (
        <>
            <Head>
                <title>{brief.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <main className="flex min-h-screen flex-col items-center justify-start bg-[#F3F3F3] px-[50px] gap-5 pb-10">
                <div className="w-full h-[400px] absolute z-0 pl-[100px] flex justify-center">
                    <Image width={1000} height={1000} loader={()=> briefIlu} src={briefIlu} className="h-full w-full bg-center bg-cover object-cover" alt="Image de la promo sélectionnée" />
                </div>

                <Link href={"/briefs"} className="px-5 py-2 bg-[#fff]/40 text-white rounded-lg text-base self-start z-10 absolute top-[50px] flex flex-row items-center justify-between w-32 ml-[100px]"><BiLeftArrowAlt className="text-3xl" /> Retour</Link>

                <div className="flex w-[80%] flex-col items-center justify-start pt-[200px] relative ml-[100px]">
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">{brief.title}</h1>
                        </span>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.desc }} />

                        <div className="flex flex-row justify-between w-full items-center mt-10 mb-5">
                            <span>
                                <h2 className="text-2xl text-black">Référentiel :</h2>
                                <div className="text-lg text-black" dangerouslySetInnerHTML={{ __html: brief.referentiel.title }} />
                            </span>
                            {open ? <button onClick={() => setOpen(!open)}><IoChevronUpCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button> : <button onClick={() => setOpen(!open)}><IoChevronDownCircleSharp className="h-[60px] w-[60px] text-[#0E6073]" /></button>}
                        </div>
                        {open &&
                            <div className="flex flex-row justify-between items-center w-full mb-5">
                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="max-w-[33%] border-2 rounded-t-lg">
                                    <p className="text-sm text-[#0E6073] m-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac arcu eget metus vehicula venenatis et a nisl.</p>
                                    <div className="flex flex-row justify-between items-center w-full rounded-lg bg-[#0E6073] p-2">
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 1</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 2</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                        <span className="flex flex-row justify-between items-center">
                                            <p className="text-white text-sm">Niveau 3</p>
                                            <BiCheck className="text-white text-xl ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }

                        <h2 className="text-2xl text-black mt-5">Contexte du projet</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.contexte }} />

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">

                        <h1 className="text-4xl font-semibold text-black">Modalités</h1>

                        <h2 className="text-2xl text-black mt-10">Modalités pédagogiques</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.modal_peda }} />

                        <h2 className="text-2xl text-black mt-10">Modalités d&apos;évaluation</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.modal_eval }} />


                        <h2 className="text-2xl text-black mt-10">Livrables</h2>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.livrable }} />

                        {brief.perf !== "" &&
                            <>
                                <h2 className="text-2xl text-black mt-10">Critères de performance</h2>
                                <div className="text-sm" dangerouslySetInnerHTML={{ __html: brief.perf }} />
                            </>}

                    </section>
                    <section className="flex w-full flex-col items-start justify-start bg-white px-[40px] py-[40px] rounded-xl mt-3">
                        <span className="flex w-full flex-row items-center justify-between mb-3">
                            <h1 className="text-4xl font-semibold text-black">Ressources du projet</h1>
                            <div className="flex flex-row justify-end w-[60%]">
                                <div className="pr-[1rem] rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[40%] min-w-[200px] max-w-[400px] flex flex-row justify-between items-center mr-2">
                                    <BiSearch className="text-3xl text-black ml-4" />
                                    <input
                                        type='text'
                                        name="searchProject"
                                        className="pr-[1rem] pl-1 py-3 w-full bg-transparent"
                                        autoComplete="off"
                                    />
                                </div>
                                <button className="flex flex-row items-center justify-between px-5 py-2 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg" onClick={() => setTab("ressource")}>Ajouter une ressource</button>
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
                                            <BiTrash className="text-3xl text-[#A10000]"/>
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
                                <Image width={1000} height={1500} loader={()=> briefIlu} src={briefIlu} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la promo sélectionnée" />
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
                                            <BiTrash className="text-3xl text-[#A10000]"/>
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
                                <Image width={1000} height={1500} loader={()=> briefIlu} src={briefIlu} className="h-full w-[20%] bg-center bg-cover object-cover rounded-r-lg" alt="Image de la promo sélectionnée" />
                            </div>
                        </div>
                    </section>
                </div>
                <Notifs />
                <NavBar />
                {tab === "ressource" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-lg p-10 w-8/12 max-h-[90%] text-[#041f25]">
                        <span className="flex flex-row justify-between">
                            <h1 className="text-3xl text-black">Créer une ressource</h1>
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
                                type="url"
                                name="imgRessource"
                                id="imgRessource"
                                className="px-[1rem] py-3 w-full rounded-lg shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]"
                                placeholder="url de l'image"
                                autoComplete="off" />
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
                                    onChange={handleSearchTerm}
                                    />
                                </div>
                                {CATEGORIES.filter((cat) => {
                                return cat.title.toLowerCase().includes(SearchTerm.toLowerCase())
                                }).map((item) => {
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
                                {CATEGORIES[selectedCat-1]?.tags.map((item) => {
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

export default Brief;