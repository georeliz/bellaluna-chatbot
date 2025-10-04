import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';

class WebhookController {
    async handleIncoming(req, res) {
        console.log('Webhook received:', JSON.stringify(req.body, null, 2));
        
        const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        const senderInfo = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
        
        console.log('Message:', message);
        console.log('Sender info:', senderInfo);
        
        if (message)  {
            await messageHandler.handleIncomingMessage(message, senderInfo);
        }
        res.status(200).send('OK');
    }

    async verifyWebhook(req, res) {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === config.verifyToken) {
            res.status(200).send(challenge);
            console.log('Webhook verified');
        } else {
            res.status(403);
        }
    }
}

export default new WebhookController();