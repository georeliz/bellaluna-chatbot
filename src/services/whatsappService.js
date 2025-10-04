import axios from 'axios';
import config from '../config/env.js';

class WhatsappService {
    async sendMessage(to, message, messageId) {
        try {
            await axios({
                method: 'POST',
                url: `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
                headers: {
                    Authorization: `Bearer ${config.apiToken}`,
                },
                data: {
                    messaging_product: 'whatsapp',
                    to,
                    type: 'text',
                    text: { body: message },
                    context: {
                        message_id: messageId,
                    },
                },
            })
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async markAsRead(messageId) {
        try {
            await axios({
                method: 'POST',
                url: `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
                headers: {
                    Authorization: `Bearer ${config.apiToken}`,
                },
                data: {
                    messaging_product: 'whatsapp',
                    status: 'read',
                    message_id: messageId,
                },
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }
}

export default new WhatsappService();