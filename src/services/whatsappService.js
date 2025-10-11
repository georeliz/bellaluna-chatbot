import axios from 'axios';
import config from '../config/env.js';

class WhatsappService {
    async sendMessage(to, message, messageId) {
        console.log('Sending message to:', to, 'Message:', message);
        
        // Check if we have valid tokens
        if (!config.apiToken || config.apiToken === 'tu_token_de_api_aqui' || 
            !config.phoneNumberId || config.phoneNumberId === 'tu_phone_number_id_aqui') {
            console.log('WhatsApp API tokens not configured, skipping message send');
            return { success: false, reason: 'API tokens not configured' };
        }
        
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
            // Don't throw error to prevent webhook failure
            return { success: false, error: error.response?.data || error.message };
        }
    }

    async markAsRead(messageId) {
        // Check if we have valid tokens
        if (!config.apiToken || config.apiToken === 'tu_token_de_api_aqui' || 
            !config.phoneNumberId || config.phoneNumberId === 'tu_phone_number_id_aqui') {
            console.log('WhatsApp API tokens not configured, skipping mark as read');
            return { success: false, reason: 'API tokens not configured' };
        }
        
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
            console.log('Message marked as read successfully');
        } catch (error) {
            console.error('Error marking message as read:', error.response?.data || error.message);
            // Don't throw error to prevent webhook failure
        }
    }

    async sendInteractiveList(to, header, body, footer, button, sections) {
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
                    type: 'interactive',
                    interactive: {
                        type: 'list',
                        header: {
                            type: 'text',
                            text: header,
                        },
                        body: {
                            text: body,
                        },
                        footer: {
                            text: footer,
                        },
                        action: {
                            button: button,
                            sections: sections,
                        },
                        rows: [
                            {
                                id: sections[0].id,
                                title: sections[0].title,
                            },
                            {
                                id: sections[1].id,
                                title: sections[1].title,
                            },
                            {
                                id: sections[2].id,
                                title: sections[2].title,
                            },
                        ],
                        description: sections[0].description,
                    },
                },
            });
        } catch (error) {
            console.error('Error sending interactive list:', error.response?.data || error.message);
            // Don't throw error to prevent webhook failure
        } finally {
            console.log('Interactive list sent successfully');
            return { success: true };
        }
    }
}

export default new WhatsappService();