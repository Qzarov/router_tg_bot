import axios from "axios";
import { msgToSend, target, serverPort, serverAddress, senderBot } from "../config.js"


async function send(text, targetId) {
    const message = {
        "platform": "reddit",
        "botName": senderBot,
        "text": text,
        "target": targetId
    }


    const url = new URL(`http://${serverAddress}:${serverPort}/api/router/message`);
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    const res = await axios({
        url: url.toString(),
        method: "POST",
        data: message,
        headers: headers
    })

    console.log(`responce:`, res.data)
}


await send(msgToSend, target)