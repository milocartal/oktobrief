import { Prisma, Promo } from "@prisma/client";
import { Session } from "next-auth";

type PromoWithAll = Prisma.PromoGetPayload<{
  include: { apprenants: true, referentiel: true }
}>

declare module "next-auth" {
    interface Session {
      id: string;
      formateur: boolean;
      superadmin: boolean;
      promo: PromoWithAll
    }
  
    interface User {
      id: string;
      formateur: boolean;
      superadmin: boolean;
      firstname: string
    }
  }