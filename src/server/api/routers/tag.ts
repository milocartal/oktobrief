import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const tagRouter = createTRPCRouter({

    getAll: publicProcedure.query(() => {
        return prisma.tag.findMany();
    }),

    create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return prisma.tag.create({
            data: {
                name: input.name,
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.tag.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(({ input }) => {
        return prisma.tag.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
            }
        })
    }),

});