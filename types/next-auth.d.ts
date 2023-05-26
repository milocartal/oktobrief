import { Session } from "next-auth";
declare module "next-auth" {
    interface Session {
      id: string;
      formateur: boolean;
      superadmin: boolean;
      
    }
  
    interface User {
      id: string;
      formateur: boolean;
      superadmin: boolean;
    }
  }