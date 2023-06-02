import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const promoRouter = createTRPCRouter({


  getAll: protectedProcedure.query(() => {
    return prisma.promo.findMany({
      include: {
        apprenants: true,
        referentiel: true,
      }
    });
  }),

  getAllForUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return prisma.promo.findMany({
      where: {
        apprenants: {
          some: {
            id: input.id
          }
        }
      },
      include: {
        apprenants: true,
        referentiel: true,
      }
    })
  }),

  create: protectedProcedure.input(z.object({ title: z.string(), desc: z.string(), idRef: z.string(), start: z.date(), end: z.date(), image: z.string() })).mutation(({ input }) => {
    return prisma.promo.create({
      data: {
        title: input.title,
        description: input.desc,
        idRef: input.idRef,
        starting: input.start,
        ending: input.end,
        image: input.image
      }
    })
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return prisma.promo.delete({
      where: {
        id: input.id
      }
    })
  }),

  update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), desc: z.string(), idRef: z.string(), start: z.date(), end: z.date() })).mutation(({ input }) => {
    return prisma.promo.update({
      where: {
        id: input.id
      },
      data: {
        title: input.title,
        description: input.title,
        idRef: input.idRef,
        starting: input.start,
        ending: input.end
      }
    })
  }),

  addStudent: protectedProcedure.input(z.object({ id: z.string(), idU: z.string() })).mutation(({ input }) => {
    return prisma.promo.update({
      where: {
        id: input.id
      },
      data: {
        apprenants: {
          connect: {
            id: input.idU
          }
        }
      }
    })
  }),

  removeStudent: protectedProcedure.input(z.object({ id: z.string(), idU: z.string() })).mutation(({ input }) => {
    return prisma.promo.update({
      where: {
        id: input.id
      },
      data: {
        apprenants: {
          disconnect: {
            id: input.idU
          }
        }
      }
    })
  }),

});
