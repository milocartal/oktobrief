import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, Promo } from "@prisma/client";
import { cp } from "fs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github"
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

type PromoWithAll = Prisma.PromoGetPayload<{
  include: { apprenants: true, referentiel: true }
}>

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
      firstname: string
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
    async session({ session, user, trigger, newSession }) {

      session.user.firstname = user.firstname
      session.user.id = user.id
      session.formateur = user.formateur
      session.superadmin = user.superadmin

      if (trigger === "update" && newSession?.promo) {
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
                id: sessionRAW!.promoId as string
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

