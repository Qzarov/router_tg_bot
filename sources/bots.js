import TelegramBot from 'node-telegram-bot-api'
import { tgBotTokens } from '../config.js'


export let bots = {}
for (const [ name, token ] of Object.entries(tgBotTokens)) {
    console.log(`adding bot ${name} with token ${token}`)
    bots[name] = new TelegramBot(token, {polling: true});
}

const trueRouterBot = bots["TrueRouterBot"]
trueRouterBot.on('message', async (msg) => {
    console.log(`trueRouterBot get message: ${msg.text}`)
    await trueRouterBot.sendMessage(msg.from.id, msg.text, {
        // parse_mode: `Markdown`,
        reply_markup: {}
    }).then();
})

const arbitragescannerMessageBot = bots["arbitragescanner_message_bot"]
arbitragescannerMessageBot.on('my_chat_member', async (msg) => {
    await handleInChatAdding(arbitragescannerMessageBot, msg)
})

const rhinoLiveScannerBot = bots["rhino_live_scanner_bot"]
rhinoLiveScannerBot.on('my_chat_member', async (msg) => {
    await handleInChatAdding(rhinoLiveScannerBot, msg)
})

async function handleInChatAdding(bot, msg) {
    console.log(`handleInChatAdding!`)

    const chat = {
        id: msg.chat.id,
        title: msg.chat.title,
        username: msg.chat.username,
        type: msg.chat.type
    }

    const new_chat_member = {
        user: {
            id: msg.new_chat_member.user.id,
            is_bot: true,
        },
        status: msg.new_chat_member.status,
        can_post_messages: msg.new_chat_member.can_post_messages,
    }
    console.log(`new member status: ${new_chat_member.status}`)
    if (new_chat_member.status !== "kicked") {
        const text = `This channel is private. You can connect it to the bot terminal via the channel ID: \`${chat.id}\``
        console.log(chat.id, text)
        try {
            await bot.sendMessage(chat.id, text, {
                parse_mode: `Markdown`,
                reply_markup: {}
            }).then();
        } catch (err) {
            console.log(`Err: ${err}`)
        }

    }
}