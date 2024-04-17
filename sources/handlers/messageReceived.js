import { tgBotTokens } from '../../config.js'
import { bots, sendErrorMessage } from '../bots.js'


export async function handleTelegramMessage(data) {
    data = JSON.parse(data.content.toString())
    console.log(`Receive telegram message:`, data)

    let botName = "TrueRouterBot";
    if (data.hasOwnProperty("botName")) {
        const botNamesList = Object.keys(tgBotTokens)
        try {
            if (botNamesList.indexOf(data.botName) === -1) {
                throw error(`⚠️ Unknown botName in received message: ${data.botName}`)
            }
            botName = data.botName;
        } catch (err) {
            const msg = `Router bot catch an error while getting "botName": ${err}`
            console.log(msg)
            console.log(`botNamesList: ${JSON.stringify(botNamesList)}`)
            sendErrorMessage(msg)
        }
        botName = data.botName;
    }

    let message = data.text + '\n\n';

    if (data.hasOwnProperty("group")) {
        message += // `From user: ${body.from}\n` +
                        `Group: ${data.group}\n`
    } else if (data.hasOwnProperty("channel")) {
        message += `Channel: ${data.channel}\n`
    }

    if (data.hasOwnProperty("link")) {
        message += `Link: ${data.link}\n`
    }

    if (data.hasOwnProperty("keywords")) {
        message += `Keys: ${data.keywords}\n`
    }

    try {
        if (!data.hasOwnProperty("target")) {
            console.log("message:", message)
            throw err(`⛔️ Property "target" is not provided`)
        }

        bots[botName].sendMessage(data.target, message, {
            // parse_mode: `Markdown`,
            reply_markup: {}
        }).then();

    } catch (err) {
        const msg = `Router bot catch an error while sending message: ${JSON.stringify(err)}`
        console.log(msg)
        sendErrorMessage(msg)
    }
}

export function handleRedditMessage(message) {
    console.log(`Receive reddit message:`, message.content.toString())
}