const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors())

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

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