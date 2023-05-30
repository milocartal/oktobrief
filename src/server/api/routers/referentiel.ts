import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const referentielRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.referentiel.findMany();
    }),

    create: protectedProcedure.input(z.object({ title: z.string() })).mutation(({ input }) => {
        return prisma.referentiel.create({
            data: {
                title: input.title,
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.referentiel.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), title: z.string() })).mutation(({ input }) => {
        return prisma.referentiel.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title,
            }
        })
    }),

});
