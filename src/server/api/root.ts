import { promoRouter } from "~/server/api/routers/promo";
import { createTRPCRouter } from "~/server/api/trpc";
import { referentielRouter } from './routers/referentiel';
import { niveauRouter } from "./routers/niveau";
import { competenceRouter } from "./routers/competence";
import { userRouter } from "./routers/user";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
