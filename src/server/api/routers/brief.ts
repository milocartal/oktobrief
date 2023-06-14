import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const briefRouter = createTRPCRouter({


    getAll: publicProcedure.query(() => {
        return prisma.brief.findMany();
    }),

    getAllForUser: protectedProcedure.input(z.object({ idU: z.string() })).query(({ input }) => {
        return prisma.brief.findMany({
            where: {
                assignations: {
                    some: {
                        idUser: input.idU
                    }
                }
            },

        })
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), desc: z.string(), idRef: z.string(), idForma: z.string(), contexte: z.string(), peda: z.string(), eval: z.string(), livrable: z.string(), perf: z.string(), img: z.string() })).mutation(({ input }) => {
        return prisma.brief.create({
            data: {
                title: input.title,
                desc: input.desc,
                idR: input.idRef,
                contexte: input.contexte,
                modal_peda: input.peda,
                modal_eval: input.eval,
                livrable: input.livrable,
                perf: input.perf,
                idFormateur: input.idForma,
                img: input.img,
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.brief.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), desc: z.string(), idRef: z.string(), contexte: z.string(), peda: z.string(), eval: z.string(), livrable: z.string(), perf: z.string() })).mutation(({ input }) => {
        return prisma.brief.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title,
                desc: input.desc,
                idR: input.idRef,
                contexte: input.contexte,
                modal_peda: input.peda,
                modal_eval: input.eval,
                livrable: input.livrable,
                perf: input.perf,
            }
        })
    }),

    addRessource: protectedProcedure.input(z.object({ id: z.string(), idRes: z.string() })).mutation(({ input }) => {
        return prisma.brief.update({
            where: {
                id: input.id
            },
            data: {
                ressources: {
                    connect: {
                        id: input.idRes
                    }
                }
            }
        })
    }),

    addNiveau: protectedProcedure.input(z.object({ id: z.string(), idNiv: z.string() })).mutation(({ input }) => {
        return prisma.brief.update({
            where: {
                id: input.id
            },
            data: {
                Niveaux: {
                    connect: {
                        id: input.idNiv
                    }
                }
            }
        })
    }),

});
