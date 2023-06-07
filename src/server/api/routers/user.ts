import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { generatePassword } from "~/utils/genertor";

export const userRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.user.findMany({
            include: {
                assignations: true,
                promos: true
            }
        });
    }),

    getApprenants: protectedProcedure.query(() => {
        return prisma.user.findMany({
            include: {
                assignations: true,
                promos: true
            },
            where: {
                formateur: false,
                superadmin: false
            }
        });
    }),

    find: protectedProcedure.input(z.object({ email: z.string() })).mutation(({ input }) => {
        return prisma.user.findUnique({
            where: {
                email: input.email
            }
        })
    }),

    create: protectedProcedure.input(z.object({ name: z.string(), firstname: z.string(), email: z.string() })).mutation(({ input }) => {
        return prisma.user.create({
            data: {
                name: input.name,
                email: input.email,
                firstName: input.firstname,
                password: generatePassword()
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), name: z.string(), firstname: z.string(), url: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                firstName: input.firstname,
                image: input.url,
            }
        })
    }),

    setFormateur: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                formateur: true
            }
        })
    }),

    setHero: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                superadmin: true
            }
        })
    }),

    unsetFormateur: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                formateur: false
            }
        })
    }),

    unsetHero: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                superadmin: false
            }
        })
    }),

    resetPassword: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.user.update({
            where: {
                id: input.id
            },
            data: {
                password: generatePassword()
            }
        })
    })

});
