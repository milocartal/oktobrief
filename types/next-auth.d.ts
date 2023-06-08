import { PromoWithAll } from "~/utils/type";
import { Session } from "next-auth";

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