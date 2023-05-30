import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const competenceRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.competence.findMany();
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), idR: z.string(), })).mutation(({ input }) => {
        return prisma.competence.create({
            data: {
                title: input.title,
                idR: input.idR
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.competence.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), idR: z.string() })).mutation(({ input }) => {
        return prisma.competence.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title,
                idR: input.idR
            }
        })
    }),

});
