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

    create: protectedProcedure.input(z.object({ title: z.string(), link: z.string()})).mutation(({ input }) => {
        return prisma.ressource.create({
            data: {
                title: input.title,
                link: input.link
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

    update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), link: z.string() })).mutation(({ input }) => {
        return prisma.ressource.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title,
                link: input.link
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

    addToPromo: protectedProcedure.input(z.object({ id: z.string(), idPromo: z.string()})).mutation(({input})=>{
        return prisma.ressource.update({
            where:{
                id: input.id
            },
            data:{
                promos:{
                    connect:{
                        id: input.idPromo
                    }
                }
            }
        })
    })

});
