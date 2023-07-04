const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(express.static('localhost'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});
const jsonParser = bodyParser.json();

bot.on('message', async (msg) => {
    console.log("Start routing")
    const chat_id = msg.chat.id;
    const json_msg = JSON.parse(msg.text);
    const from_user = {
        id: msg.from.id,
        username: msg.from.username,
    }

    let source = "";
    if (json_msg.hasOwnProperty("group")) {
        source = `From user: ${json_msg.from}\n` +
                 `Group: ${json_msg.group}\n`
    } else if (json_msg.hasOwnProperty("channel")) {
        source = `Channel: ${json_msg.channel}\n`
    }

    const text = `${json_msg.text}\n\n`          +
                 source +
                `Link: ${json_msg.link}\n`       +
                `Keys: ${json_msg.keywords}`;

    console.log("new message:", text)

    bot.sendMessage(json_msg.target, text, {
        reply_markup: {}
    }).then();
})

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Parser, is it you?');
});

app.post(`/api/router/message`, jsonParser, (req, res) => {
    // const authData = req.auth

    if (!req.body) return res.sendStatus(400);
    const body = req.body;

    let messageSource = '';
    if (body.hasOwnProperty("group")) {
        messageSource = `From user: ${body.from}\n` +
                        `Group: ${body.group}\n`
    } else if (body.hasOwnProperty("channel")) {
        messageSource = `Channel: ${body.channel}\n`
    }

    const text = `${body.text}\n\n`          +
        messageSource +
        `Link: ${body.link}\n`       +
        `Keys: ${body.keywords}`;

    console.log("new message:", text)

    bot.sendMessage(body.target, text, {
        reply_markup: {}
    }).then();

    res.sendStatus(200)
})

const port = 8000
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}\n`);
})