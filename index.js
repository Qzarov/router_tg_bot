// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import bodyParser from 'body-parser'

import {serverAddress, tgBotTokens, supportedPlatforms} from './config.js'


console.log(`Server address: ${serverAddress}`)
const app = express();
app.use(express.static(serverAddress));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

//const token = process.env.BOT_TOKEN;
// const bot = new TelegramBot(token, {polling: true});
const jsonParser = bodyParser.json();

let bots = {}
for (const [ name, token ] of Object.entries(tgBotTokens)) {
    console.log(`adding bot ${name} with token ${token}`)
    bots[name] = new TelegramBot(token, {polling: false});
}

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Parser, is it you?');
});

app.post(`/api/router/message`, jsonParser, (req, res) => {
    // const authData = req.auth
    console.log("get post request:", res)

    if (!req.body) return res.sendStatus(400);
    const body = req.body;

    let platform = "telegram";
    if (body.hasOwnProperty("platform")) {
        try {
            if (supportedPlatforms.indexOf(body.platform) === -1) {
                throw error(`⛔️ Not supported platform in message body: ${body.platform}`)
            }
            platform = body.platform;
        } catch (err) {
            console.log(err)
        }
    }

    let botName = "TrueRouterBot";
    if (body.hasOwnProperty("botName")) {
        const botNamesList = Object.keys(tgBotTokens)
        try {
            if (botNamesList.indexOf(body.botName) === -1) {
                throw error(`⚠️ Unknown botName in message body: ${body.botName}`)
            }
            botName = body.botName;
        } catch (err) {
            console.log(err)
        }
        botName = body.botName;
    }

    let message = body.text + '\n\n';

    if (body.hasOwnProperty("group")) {
        message += // `From user: ${body.from}\n` +
                        `Group: ${body.group}\n`
    } else if (body.hasOwnProperty("channel")) {
        message += `Channel: ${body.channel}\n`
    }

    if (body.hasOwnProperty("link")) {
        message += `Link: ${body.link}\n`
    }

    if (body.hasOwnProperty("keywords")) {
        message += `Keys: ${body.keywords}\n`
    }

    console.log("new message:", message)
    try {
        if (!body.hasOwnProperty("target")) {
            throw err(`⛔️ Property "target" is not provided`)
        }

        bots[botName].sendMessage(body.target, message, {
            // parse_mode: `Markdown`,
            reply_markup: {}
        }).then();

        res.sendStatus(200)

    } catch (err) {
        console.log(`Error occured: ${err}`)
    }
})

const port = 8000
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}\n`);
})