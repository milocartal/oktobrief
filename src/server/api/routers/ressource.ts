import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const ressourceRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.ressource.findMany();
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), link: z.string(), img: z.string()})).mutation(({ input }) => {
        return prisma.ressource.create({
            data: {
                title: input.title,
                link: input.link,
                img: input.img
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.ressource.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), link: z.string(), img: z.string() })).mutation(({ input }) => {
        return prisma.ressource.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title,
                link: input.link,
                img: input.img
            }
        })
    }),

    addToBrief: protectedProcedure.input(z.object({ id: z.string(), idBrief: z.string()})).mutation(({input})=>{
        return prisma.ressource.update({
            where:{
                id: input.id
            },
            data:{
                briefs:{
                    connect:{
                        id: input.idBrief
                    }
                }
            }
        })
    }),

    addTag: protectedProcedure.input(z.object({ id: z.string(), idTag: z.string()})).mutation(({input})=>{
        return prisma.ressource.update({
            where:{
                id: input.id
            },
            data:{
                tags:{
                    connect:{
                        id: input.idTag
                    }
                }
            }
        })
    }),

    removeTag: protectedProcedure.input(z.object({ id: z.string(), idTag: z.string()})).mutation(({input})=>{
        return prisma.ressource.update({
            where:{
                id: input.id
            },
            data:{
                tags:{
                    disconnect:{
                        id: input.idTag
                    }
                }
            }
        })
    }),

});
