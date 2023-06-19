import { promoRouter } from "~/server/api/routers/promo";
import { createTRPCRouter } from "~/server/api/trpc";
import { referentielRouter } from './routers/referentiel';
import { niveauRouter } from "./routers/niveau";
import { competenceRouter } from "./routers/competence";
import { userRouter } from "./routers/user";
import { assignationRouter } from "./routers/assignation";
import { briefRouter } from "./routers/brief";
import { ressourceRouter } from "./routers/ressource";
import { tagRouter } from "./routers/tag";
import { categorieRouter } from './routers/categorie';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  promo: promoRouter,
  referentiel: referentielRouter,
  competence: competenceRouter,
  niveau: niveauRouter,
  assignation: assignationRouter,
  brief: briefRouter,
  ressource: ressourceRouter,
  tag: tagRouter,
  categorie: categorieRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
