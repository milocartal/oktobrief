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

    getOne: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string() })).mutation(({ input }) => {
        return prisma.assignation.findUnique({
            where: {
                idBrief_idUser:{
                    idBrief: input.idB,
                    idUser: input.idU
                }

            }
        })
    }),

    create: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string(), end: z.date() })).mutation(({ input }) => {
        return prisma.assignation.create({
            data: {
                idBrief: input.idB,
                idUser: input.idU,
                ending: input.end
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string() })).mutation(({ input }) => {
        return prisma.assignation.delete({
            where: {
                idBrief_idUser:{
                    idBrief: input.idB,
                    idUser: input.idU
                }
            }
        })
    }),

    setFinished: protectedProcedure.input(z.object({ idU: z.string(), idB: z.string() })).mutation(({ input }) => {
        return prisma.assignation.update({
            where: {
                idBrief_idUser:{
                    idBrief: input.idB,
                    idUser: input.idU
                }
            },
            data: {
                rendu: true,
            }
        })
    }),
});
