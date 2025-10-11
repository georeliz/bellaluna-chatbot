import whatsappService from './whatsappService.js';

class MessageHandler {
    async handleIncomingMessage(message, senderInfo) {
        console.log('Processing message:', message);
        console.log('Sender info:', senderInfo);
        
        try {
            if(message.type === 'text'){
                const incomingMessage = message.text.body.toLowerCase().trim();
                console.log('Incoming text:', incomingMessage);

                if(this.isGreeting(incomingMessage)){
                    console.log('Greeting detected, sending welcome message');
                    await this.sendWelcomeMessage(message.from, message.id, senderInfo);
                    await this.sendInteractiveList(message.from);
                } else {
                    const response = `Echo: ${message.text.body}`;
                    console.log('Sending echo response:', response);
                    await whatsappService.sendMessage(message.from, response, message.id);
                }
                await whatsappService.markAsRead(message.id);
            } else {
                console.log('Non-text message received, type:', message.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            // No re-throw the error to prevent webhook failure
        }
    }
    isGreeting(message) {
        const greetingMessages = ['hi', 'hello', 'hey', 'hola', 'hi there', 'hello there', 'hey there', 'hola there'];
        return greetingMessages.includes(message);
    }

    getSenderName(senderInfo){
        return senderInfo.profile?.name || senderInfo.wa_id;
    }

    async sendWelcomeMessage(to, message_id, senderInfo) {
        const name = this.getSenderName(senderInfo);
        const welcomeMessage = `Welcome ${name} to the Bellaluna family!' + 'how can I help you today?`;
        await whatsappService.sendMessage(to, welcomeMessage, message_id);
        
    }

    async sendInteractiveList(to, sections) {
        const header = 'Choose your option';
        const body = 'Choose your option';
        const footer = 'Choose your option';
        const button = 'Choose your option';
        const sections = [
            {
                id: '1',
                title: 'Rings',
                description: 'Option 1 description',
            },
        ];
        await whatsappService.sendInteractiveList(to, header, body, footer, button, sections);
    }
}

export default new MessageHandler();