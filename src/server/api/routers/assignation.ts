import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const assignationRouter = createTRPCRouter({

    getAll: publicProcedure.query(() => {
        return prisma.assignation.findMany();
    }),

    getOne: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string(), idP: z.string() })).mutation(({ input }) => {
        return prisma.assignation.findUnique({
            where: {
                idBrief_idUser_idPromo:{
                    idBrief: input.idB,
                    idUser: input.idU,
                    idPromo: input.idP
                }

            }
        })
    }),

    create: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string(), idP: z.string(), end: z.date() })).mutation(({ input }) => {
        return prisma.assignation.create({
            data: {
                idBrief: input.idB,
                idUser: input.idU,
                idPromo: input.idP,
                ending: input.end
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string(), idP: z.string() })).mutation(({ input }) => {
        return prisma.assignation.delete({
            where: {
                idBrief_idUser_idPromo:{
                    idBrief: input.idB,
                    idUser: input.idU,
                    idPromo: input.idP
                }
            }
        })
    }),

    setFinished: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string(), idP: z.string() })).mutation(({ input }) => {
        return prisma.assignation.update({
            where: {
                idBrief_idUser_idPromo:{
                    idBrief: input.idB,
                    idUser: input.idU,
                    idPromo: input.idP
                }
            },
            data: {
                rendu: true,
            }
        })
    }),
});
