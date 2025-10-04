import axios from 'axios';
import config from '../config/env.js';

class WhatsappService {
    async sendMessage(to, message, messageId) {
        console.log('Sending message to:', to, 'Message:', message);
        try {
            const response = await axios({
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
            });
            console.log('Message sent successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
            throw error;
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