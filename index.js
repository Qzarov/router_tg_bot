const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(express.static('164.92.143.234'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});
const jsonParser = bodyParser.json();


bot.on('new_chat_participant', async (msg) => {
    console.log(`bot was adddded, get msg: ${msg}`)
    console.log(`${msg["new_chat_participant"]}`)
    bot_obj = await bot.get_me()
    bot_id = bot_obj.id

    for(let chat_member of msg.new_chat_members) {
        if (chat_member.id === bot_id) {
            console.log(`I was added!`)
            // await message.reply(`This channel is private. You can connect it to the bot terminal via the channel ID: ${chanId}`)
        }
            
    }
})


bot.on('my_chat_member', async (msg) => {
    // console.log(`my_chat_member: ${JSON.stringify(msg)}`)

    chat = {
        id: msg.chat.id,
        title: msg.chat.title,
        username: msg.chat.username,
        type: msg.chat.type
    }

    new_chat_member = {
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
})


bot.on('message', async (msg) => {
    console.log("Start routing")
    // console.log(`get msg: ${JSON.stringify(msg)}`)

    // let text = ""
    // if (msg.hasOwnProperty("text")) {
    //     text = msg.text;
    // }
    // console.log(`get text: ${text}`)

    let chat = {}
    if (msg.hasOwnProperty("chat")) {
        chat = {
            id: msg.chat.id,
            username: msg.chat.username,
            title: msg.chat.title,
        } 
    }    
    console.log(`get chat ${chat.title}: ${chat.id}, ${chat.username}`)

    from_user = {}
    if (msg.hasOwnProperty("from")) {
        from_user = {
            id: msg.from.id,
            username: msg.from.username,
        }
    }
    console.log(`get from_user: ${from_user.username}, ${from_user.id}`)

    new_chat_member = {}
    if (msg.hasOwnProperty("new_chat_member")) {
        new_chat_member = {
            id: msg.new_chat_member.id,
            username: msg.new_chat_member.username,
        }
    }

})

app.get('/', (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send('Parser, is it you?');
});

app.post(`/api/router/message`, jsonParser, (req, res) => {
    // const authData = req.auth
    console.log("get post request:", res)

    if (!req.body) return res.sendStatus(400);
    const body = req.body;

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
        bot.sendMessage(body.target, message, {
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