import { Prisma } from "@prisma/client"

export type BriefWithAll = Prisma.BriefGetPayload<{
    include: { promos: true, assignations: true, formateur: true }
}>
export type PromoWithAll = Prisma.PromoGetPayload<{
    include: { apprenants: true, referentiel: true }
}>

export type UserWithAll = Prisma.UserGetPayload<{
    include: { promos: true, assignations: true }
}>

export type PromoWithStudent = Prisma.PromoGetPayload<{
    include: {
        apprenants: {
            include: {
                promos: true,
                assignations: true
            }
        }
    }
}>

export type RefeWithComp = Prisma.ReferentielGetPayload<{
    include: {
        competences: {
            include: {
                niveaux: true
            }
        }
    }
}>

export type CompWithLvl = Prisma.CompetenceGetPayload<{
    include: {
        niveaux: true
    }
}>

