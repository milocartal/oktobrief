const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const load = async () => {
    try {

        const tempRef = await prisma.referentiel.create({
            data: {
                title: "Seed"
            }
        })

        console.log("ref test created")

        await prisma.promo.create({
            data: {
                title: "Seed",
                description: "Seed",
                idRef: tempRef.id,
                starting: new Date('2000-08-03T23:03:00'),
                ending: new Date('2003-11-20T19:11:00'),
                image: "https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif"
            }
        })
        console.log("Promo test created")
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect
    }
}

load();