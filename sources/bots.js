import TelegramBot from 'node-telegram-bot-api'
import { tgBotTokens, errorsSenderBot } from '../config.js'


export let bots = {}

for (const [ name, token ] of Object.entries(tgBotTokens)) {
    console.log(`adding bot ${name} with token ${token}`)
    bots[name] = new TelegramBot(token, {polling: true});
}


if (bots["DeScienzz_bot"]) {
    const bot = bots["DeScienzz_bot"]
    bot.on('message', async (msg) => {
        console.log(`DeScienzz_bot get message: ${msg.text}`)
        await bot.sendMessage(msg.from.id, msg.text, {
            // parse_mode: `Markdown`,
            reply_markup: {}
        }).then();
    })
}

if (bots["TrueRouterBot"]) {
    const trueRouterBot = bots["TrueRouterBot"]
    trueRouterBot.on('message', async (msg) => {
        console.log(`trueRouterBot get message: ${msg.text}`)
        await trueRouterBot.sendMessage(msg.from.id, msg.text, {
            // parse_mode: `Markdown`,
            reply_markup: {}
        }).then();
    })
}

if (bots["arbitragescanner_message_bot"]) {
    const arbitragescannerMessageBot = bots["arbitragescanner_message_bot"]
    arbitragescannerMessageBot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(arbitragescannerMessageBot, msg)
    })
}

if (bots["NFTNotifierBot"]) {
    const nftScannerBot = bots["NFTNotifierBot"]
    nftScannerBot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(nftScannerBot, msg)
    })
}

if (bots["arbitragescanner_reddit_bot"]) {
    const redditProdScannerBot = bots["arbitragescanner_reddit_bot"]
    redditProdScannerBot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(redditProdScannerBot, msg)
    })
}

if (bots["reddit_streamer_bot"]) {
    const redditScannerBot = bots["reddit_streamer_bot"]
    redditScannerBot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(redditScannerBot, msg)
    })
}

if (bots["arbitragescanner_nft_bot"]) {
    const arbitragescannerNftBot = bots["arbitragescanner_nft_bot"]
    arbitragescannerNftBot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(arbitragescannerNftBot, msg)
    })
}

if (bots["MaxProfitTelegrammScanRobot"]) {
    const MaxProfitTelegrammScanRobot = bots["MaxProfitTelegrammScanRobot"]
    MaxProfitTelegrammScanRobot.on('my_chat_member', async (msg) => {
        await handleInChatAdding(MaxProfitTelegrammScanRobot, msg)
    })
}

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
        const text = `You can connect this channel to the bot terminal via the channel ID: \`${chat.id}\``
        console.log(chat.id, text)
        try {
            await bot.sendMessage(chat.id, text, {
                parse_mode: `Markdown`,
                reply_markup: {}
            }).then();
        } catch (err) {
            const msg = `Router bot catch an error while getting "botName": ${err}`
            console.log(msg)
            sendErrorMessage(msg)
        }

    }
}

async function sendErrorMessage(message) {
    try {
        await bots[errorsSenderBot].sendMessage(chat.id, message, {
            parse_mode: `Markdown`,
            reply_markup: {}
        }).then();
    } catch (err) {
        console.log(`⛔️  Err: ${err}`)
    }
}

export {
    sendErrorMessage
}