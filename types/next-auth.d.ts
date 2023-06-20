import { PromoWithAll } from "~/utils/type";
import { Session } from "next-auth";

declare module "next-auth" {
    interface Session {
      id: string;
      formateur: boolean;
      superadmin: boolean;
      promo: PromoWithAll;
      color: string;
    }
  
    interface User {
      id: string;
      formateur: boolean;
      superadmin: boolean;
      firstName: string;
      color: string;
    }
  }