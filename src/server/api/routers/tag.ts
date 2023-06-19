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

    addToCateg: protectedProcedure.input(z.object({ id: z.string(), idCateg: z.string() })).mutation(({ input }) => {
        return prisma.tag.update({
            where: {
                id: input.id
            },
            data: {
                categories:{
                    connect:{
                        id: input.idCateg
                    }
                }
            }
        })
    }),

    removeFromCateg: protectedProcedure.input(z.object({ id: z.string(), idCateg: z.string() })).mutation(({ input }) => {
        return prisma.tag.update({
            where: {
                id: input.id
            },
            data: {
                categories:{
                    disconnect:{
                        id: input.idCateg
                    }
                }
            }
        })
    }),

    addToBrief: protectedProcedure.input(z.object({ id: z.string(), idBrief: z.string() })).mutation(({ input }) => {
        return prisma.tag.update({
            where: {
                id: input.id
            },
            data: {
                briefs:{
                    connect:{
                        id: input.idBrief
                    }
                }
            }
        })
    }),

    removeFromBrief: protectedProcedure.input(z.object({ id: z.string(), idBrief: z.string() })).mutation(({ input }) => {
        return prisma.tag.update({
            where: {
                id: input.id
            },
            data: {
                briefs:{
                    disconnect:{
                        id: input.idBrief
                    }
                }
            }
        })
    }),

});
