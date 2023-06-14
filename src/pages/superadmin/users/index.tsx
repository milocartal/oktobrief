import { InferGetServerSidePropsType, type GetServerSideProps, type NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";


import { NavBar, Notifs } from "~/components/barrel";
import { prisma } from "~/server/db";
import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { aleatoirePP } from "~/utils/genertor";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";


export const getServerSideProps: GetServerSideProps<{ users: User[] }> = async function (context) {
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

    const users = await prisma.user.findMany()

    if (!users) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            users: JSON.parse(JSON.stringify(users)) as User[]
        }
    }
};

const UsersList: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ users }) => {

   const [SearchTerm, setSearchTerm] = useState('');
   const [filterF, setFilterF] = useState(false);
   const [filterA, setFilterA] = useState(false);

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

    return (
        <>
            <Head>
                <title>Liste des utilisateurs</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-start justify-start bg-[#F3F3F3] pl-[100px]">
                <div className="flex min-h-screen w-full flex-col items-center justify-start px-[10%] pt-[40px]">
                    <section className="w-full flex flex-col bg-white rounded-lg px-[60px] py-[40px] mb-5">
                        <span className="flex flex-row items-center justify-end">
                            <fieldset className="flex flex-row items-center">
                                <input type="checkbox" id="formateur" name={filterF} onChange={() => setFilterF(!filterF)} className="mr-2"/>
                                <label for="formateur" className="mr-3">Formateurs</label>
                                <input type="checkbox" id="apprenant" name={filterA} onChange={() => setFilterA(!filterA)} className="mr-2"/>
                                <label for="apprenant" className="mr-5">Apprenants</label>
                            </fieldset>
                            <div className="pr-5 rounded-full bg-white shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-[30%] flex flex-row justify-between items-center self-end mr-2 mb-3">
                                <BiSearch className="text-3xl text-black ml-4"/>
                                <input
                                    type='text'
                                    name="searchProject"
                                    className="pr-[1rem] pl-1 py-2 w-full bg-transparent"
                                    autoComplete="off"
                                    onChange={handleSearchTerm}
                                />
                            </div>
                        </span>
                        <div className="w-full grid grid-cols-2 gap-x-10 gap-y-2 content-stretch">
                            {users.filter((user) => {
                                if(filterF === true){
                                    return user.formateur == true && user.firstName?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.formateur == true && user.name?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.formateur == true && user.email?.toLowerCase().includes(SearchTerm.toLowerCase())
                                } if(filterA === true){
                                    return user.formateur == false && user.superadmin == false && user.firstName?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.formateur == false && user.superadmin == false && user.name?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.formateur == false && user.superadmin == false && user.email?.toLowerCase().includes(SearchTerm.toLowerCase())
                                } else {
                                    return user.firstName?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.name?.toLowerCase().includes(SearchTerm.toLowerCase()) || user.email?.toLowerCase().includes(SearchTerm.toLowerCase())
                                }
                            }).map((user) => {
                                let pp = aleatoirePP()
                                if (user.image !== "" && user.image !== null) {
                                    pp = user.image
                                }
                                return (
                                    <Link href={`/superadmin/users/`} className="flex flex-row justify-between items-center w-full mt-5" key={user.id}>
                                        <div className="flex flex-row items-center max-w-[75%]">
                                            <Image width={300} height={300} loader={() => pp} src={pp} className="w-20 h-20 rounded-full object-cover mr-3" alt="Photo de profil utilisateur" />
                                            <div className="">
                                                <p className="text-base text-black font-semibold">{user.firstName} {user.name}</p>
                                                <p className="text-sm text-black">{user.email}</p>
                                            </div>
                                        </div>
                                        <p>{user.superadmin? "Super Admin" : user.formateur ? "Formateur" : "Apprenant"}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                </div>
                <Notifs />
                <NavBar />
            </main>
        </>
    );
};

export default UsersList;