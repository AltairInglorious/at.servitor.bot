import {Context, Telegraf} from "telegraf";
import {Update} from 'typegram';
import {getTimeToNextDay, getTiming} from "../lib";
import {IScheldureObject} from "../lib/interfaces/IScheldureObject";
import {prisma} from '../server'

let bot: Telegraf<Context<Update>>

export async function broadcast(msg: string) {
    const users = await prisma.user.findMany({
        select: {
            tgId: true
        }
    })
    for (const u of users) {
        bot.telegram.sendMessage(Number(u.tgId), msg, {
            parse_mode: "HTML"
        })
    }
}

async function initTimers(timing: IScheldureObject[]) {
    console.log('Init timers')
    for (const el of timing) {
        if (el.time > 0) {
            setTimeout(async () => {
                broadcast(`Час молитви ${el.name}`)
            }, el.time)
        }
    }
}

async function initSchedule() {
    getTiming()
        .then((res: IScheldureObject[]) => {
            initTimers(res)
            setTimeout(() => {
                initSchedule()
            }, getTimeToNextDay())
        })
        .catch((e) => {
            console.log('Error reinit schedule in 10s...')
            console.error(e)
            setTimeout(() => {
                initSchedule()
            }, 10000)
        })
}

export async function startBot() {
    bot = new Telegraf(process.env["BOT_TOKEN"] as string)

    bot.on('my_chat_member', async (ctx) => {
        if (ctx.update.my_chat_member.new_chat_member.status == 'member') {
            console.log(`New user [${ctx.from.id}]`)
            await prisma.user.upsert({
                where: {
                    tgId: ctx.from.id
                },
                update: {
                    isActive: true
                },
                create: {
                    tgId: ctx.from.id,
                }
            })
        } else {
            console.log(`Drop user [${ctx.from.id}]`)
            try {
                await prisma.user.update({
                    data: {
                        isActive: false
                    },
                    where: {
                        tgId: ctx.from.id
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    })

    bot.start(async (ctx) => {
        ctx.reply('Привіт, я сервітор Адама')
    })

    bot.launch()
    initSchedule()
}
