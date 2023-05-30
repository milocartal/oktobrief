import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.user.findMany({
            include:{
                assignations: true,
                promos: true
            }
        });
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), name: z.string(), url: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                image: input.url
            }
        })
    }),

    setFormateur: protectedProcedure.input(z.object({id: z.string()})).mutation(({input})=>{
        return prisma.user.update({
            where:{
                id: input.id
            },
            data:{
                formateur: true
            }
        })
    }),

    setHero: protectedProcedure.input(z.object({id: z.string()})).mutation(({input})=>{
        return prisma.user.update({
            where:{
                id: input.id
            },
            data:{
                superadmin: true
            }
        })
    }),

    unsetFormateur: protectedProcedure.input(z.object({id: z.string()})).mutation(({input})=>{
        return prisma.user.update({
            where:{
                id: input.id
            },
            data:{
                formateur: false
            }
        })
    }),

    unsetHero: protectedProcedure.input(z.object({id: z.string()})).mutation(({input})=>{
        return prisma.user.update({
            where:{
                id: input.id
            },
            data:{
                superadmin: false
            }
        })
    }),

});
