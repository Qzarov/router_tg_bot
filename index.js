import express from 'express'
import bodyParser from 'body-parser'

import {serverAddress, tgBotTokens, supportedPlatforms, serverPort} from './config.js'
import { bots, sendErrorMessage } from './sources/bots.js'


console.log(`Server address: ${serverAddress}`)
const app = express();
app.use(express.static(serverAddress));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const jsonParser = bodyParser.json();

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Scanner, I finally found you!');
});

app.post(`/api/router/message`, jsonParser, (req, res) => {
    // const authData = req.auth
    console.log("get new post request:", req.body)

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
            msg = `Router bot catch an error while getting "platform": ${err}`
            console.log(msg)
            sendErrorMessage(msg)
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
            const msg = `Router bot catch an error while getting "botName": ${err}`
            console.log(msg)
            console.log(`botNamesList: ${JSON.stringify(botNamesList)}`)
            console.log(`response body: ${JSON.stringify(body)}`)
            sendErrorMessage(msg)
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
            console.log("message:", message)
            throw err(`⛔️ Property "target" is not provided`)
        }

        bots[botName].sendMessage(body.target, message, {
            // parse_mode: `Markdown`,
            reply_markup: {}
        }).then();

        res.sendStatus(200)

    } catch (err) {
        const msg = `Router bot catch an error while sending message: ${JSON.stringify(err)}`
        console.log(msg)
        sendErrorMessage(msg)
    }
})

const port = serverPort
const server = app.listen(port, (error) => {
    if (error) {
        sendErrorMessage(msg)
        return console.log(`Error: ${error}`);
    }

    console.log(`Server listening on port ${server.address().port}\n`);
})