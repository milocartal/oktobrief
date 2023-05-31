import { GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import NavBar from "./../../components/navbar";
import Notifs from "./../../components/notifs";
import Promo from "./../../components/promo";
import { BiCalendarAlt } from "react-icons/bi";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{}> = async function (context) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: { session }
    }
};

const CreerPromo: NextPage = () => {

//   const REFS = [
//     {
//         "id": 1,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 2,
//         "nom": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
//     },
//     {
//         "id": 3,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 4,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 5,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 6,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 7,
//         "nom": "Lorem ipsum dolor sit amet"
//     },
//     {
//         "id": 8,
//         "nom": "Lorem ipsum dolor sit amet"
//     }
// ]

  // const refsPairs = REFS.reduce(
  // (result, value, index, array) => {
  //     if (index % 3 === 0)
  //       result.push(array.slice(index, index + 3));
  //       console.log(result)
  //     return result;
  //   }, []);

  return (
    <>
      <Head>
        <title>OktoBrief</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen min-w-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
        <div className="flex min-h-screen h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
          <span className="flex w-full flex-row items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-black">Nouvelle promo</h1>
            <Promo />
          </span>
          <div className="flex flex-row h-[73%] w-full flex flex-row justify-between">
            <div className="bg-white h-full w-[59%] p-5">
              <p className="text-[#A10000]">* Obligatoire</p>
              <span className="flex flex-row mt-3">
                <p>Titre de la promo</p>
                <p className="text-[#A10000]">*</p>
              </span>
              <input
                type='text'
                name="promoTitle"
                className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                autoComplete="off"
              />
              <span className="flex flex-row mt-3">
                <p>Description de la promo</p>
                <p className="text-[#A10000]">*</p>
              </span>
              <textarea
                name="promoDesc"
                className="px-[1rem] py-3 rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                autoComplete="off"
                rows={4}
              />
              <span className="flex flex-row mt-3">
                <p>Référentiel</p>
                <p className="text-[#A10000]">*</p>
              </span>
              {/* {refsPairs.map((trois) => {
                  return (
                      <span className="flex flex-row justify-start items-center w-full mt-5">
                          {trois.map((item: { id: Key | null | undefined; }) => {
                            <div key={item.id}>
                              <p>{item.nom}</p>
                            </div>
                          })}
                      </span>
                  )
              })} */}
              
            </div>
            <div className="bg-white h-full w-[40%] p-5">
              <span className="flex flex-row mt-9">
                <p>Date de début</p>
                <p className="text-[#A10000]">*</p>
              </span>
              <div className="pr-[1rem] rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full flex flex-row justify-between items-center">
                <input
                  type='text'
                  name="promoDateStart"
                  placeholder="01/01/2023"
                  className="px-[1rem] py-3 w-full bg-transparent"
                  autoComplete="off"
                />
                <BiCalendarAlt className="text-3xl text-black" />
              </div>

              <span className="flex flex-row mt-3">
                <p>Date de fin</p>
                <p className="text-[#A10000]">*</p>
              </span>
              <div className="pr-[1rem] rounded-lg bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full flex flex-row justify-between items-center">
                <input
                  type='text'
                  name="promoDateEnd"
                  placeholder="01/01/2023"
                  className="w-full px-[1rem] py-3 bg-transparent"
                  autoComplete="off"
                />
                <BiCalendarAlt className="text-3xl text-black" />
              </div>
              <div className="flex flex-col items-center justify-center w-full h-[220px] bg-[#2EA3A5]/50 rounded-lg mt-3 shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]">
                <p className="text-sm text-white">Faites glisser une image ou</p>
                <button className="bg-white rounded-lg w-[80%] py-3 mt-2">
                <p className="text-sm text-[#0E6073]">Importez depuis votre appareil</p>
                </button>
              </div>
            </div>
          </div>
          <Link href={""} className="flex flex-row items-center justify-between px-5 py-4 mt-3 bg-[#2EA3A5] hover:bg-[#288F90] text-white rounded-lg self-end">
            <p className="text-base text-center">Enregistrer et ajouter des apprenants à la promo</p>
          </Link>
        </div>

        <Notifs />
        <NavBar />
      </main>
    </>
  );
};

export default CreerPromo;