import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github"
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { type PromoWithAll } from "~/utils/type";
import { type Session as SessionAuth } from 'next-auth';
import { type AdapterUser } from "next-auth/adapters";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      promo: PromoWithAll,
      id: string;
      formateur: boolean;
      superadmin: boolean;
      firstname: string;
      color: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  /*callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        formateur: user.formateur,
        superadmin: user.superadmin
      },
    }),
  },*/
  callbacks: {
    async session({ session, user, trigger, newSession }: {session: SessionAuth, user: AdapterUser, trigger: string, newSession: SessionAuth}) {

      session.user.firstname = user.firstName
      session.user.id = user.id
      session.formateur = user.formateur
      session.superadmin = user.superadmin
      session.color = user.color

      if (trigger === "update" && newSession && newSession.promo) {
        session.promo = newSession.promo;
        const sessionRAW = await prisma.session.findFirst({
          where: {
            userId: session.user.id,
            expires: session.expires
          }
        })
        await prisma.session.update({
          data: {
            promoId: session.promo.id
          },
          where: {
            id: sessionRAW!.id
          }
        })
      }
      if (!session.promo) {
        const sessionRAW = await prisma.session.findFirst({
          where: {
            userId: session.user.id,
            expires: session.expires
          }
        })

        let promo;

        if(user.superadmin && sessionRAW && sessionRAW.promoId === null){
          promo = await prisma.promo.findFirst()
        }
        else{
          if (sessionRAW && sessionRAW.promoId !== null) {
            promo = await prisma.promo.findFirst({
              where: {
                id: sessionRAW.promoId
              },
              include: {
                apprenants: true,
                referentiel: true
              }
            })
          } else {
            promo = await prisma.promo.findFirstOrThrow({
              where: {
                apprenants: {
                  some: {
                    id: user.id
                  }
                }
              },
              include: {
                apprenants: true,
                referentiel: true
              }
            })
          }
        }
        session.promo = promo as PromoWithAll;
      }
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

