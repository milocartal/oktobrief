import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const niveauRouter = createTRPCRouter({

    getAll: protectedProcedure.query(() => {
        return prisma.niveau.findMany();
    }),

    create: protectedProcedure.input(z.object({ title: z.string(), idC: z.string(), todo: z.string(), eval: z.string() })).mutation(({ input }) => {
        return prisma.niveau.create({
            data: {
                title: input.title,
                idC: input.idC,
                todo: input.todo,
                eval: input.eval
            }
        })
    }),

    delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        return prisma.niveau.delete({
            where: {
                id: input.id
            }
        })
    }),

    update: protectedProcedure.input(z.object({ id: z.string(), todo: z.string(), eval: z.string() })).mutation(({ input }) => {
        return prisma.niveau.update({
            where: {
                id: input.id
            },
            data: {
                todo: input.todo,
                eval: input.eval
            }
        })
    }),

});
