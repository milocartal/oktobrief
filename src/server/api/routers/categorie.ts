import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const categorieRouter = createTRPCRouter({

    getAll: publicProcedure.query(() => {
        return prisma.categorie.findMany({
            include: {
                tags: true
            }
        });
    }),

    create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return prisma.categorie.create({
            data: {
                name: input.name,
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.categorie.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(({ input }) => {
        return prisma.categorie.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
            }
        })
    }),

});
