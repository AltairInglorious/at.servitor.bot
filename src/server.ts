import {startBot} from "./module";
import * as dotenv from 'dotenv'
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient()

async function main() {
    dotenv.config()
    startBot()
}

main()
    .then(() => console.log('Running...'))
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
