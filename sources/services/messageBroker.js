import { connect } from 'amqplib'

export default class MessageBroker {
    constructor(connectionParams) {
        this.connectionParams = connectionParams
        this.queues = {}
        this.inited = false
    }

    async init () {
        this.connection = await connect(this.connectionParams)
        this.channel = await this.connection.createChannel()
        this.inited = true
        return this
    }

    async createExchange ({ name, type, durable = true }) {
        if (!this.connection) await this.init()
        await this.channel.assertExchange(name, type, { durable })
        this.exchange = name
        return this
    }

    isInited() { return this.inited }

    /**
     * Send message to an queue
     * @param {string} - queue name
     * @param {Object} msg Message as Buffer
     */
    async send(queue, msg) {
        this.channel.assertQueue(queue, {
            durable: false
        });
        
        this.channel.sendToQueue(queue, Buffer.from(msg));
    }

    /**
     * @param {Object} - object defining queue name and bindingKey
     * @param {Function} handler Handler that will be invoked with given message and acknowledge function (msg, ack)
     */
    async subscribe(queue, handler) {
        console.log("✅ Subscribed to", queue);
        this.channel.consume(
            queue, 
            async function(msg) { await handler(msg) }, 
            { noAck: true }
        );
    }

    async unsubscribe (queue, handler) {
        _.pull(this.queues[queue], handler)
    }
}



