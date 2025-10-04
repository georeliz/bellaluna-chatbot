import whatsappService from './whatsappService.js';

class MessageHandler {
    async handleIncomingMessage(message) {
        console.log('Processing message:', message);
        
        if(message.type === 'text'){
            const incomingMessage = message.text.body.toLowerCase().trim();
            console.log('Incoming text:', incomingMessage);

            if(this.isGreeting(incomingMessage)){
                console.log('Greeting detected, sending welcome message');
                await this.sendWelcomeMessage(message.from, message.id);
            }
                else{
                    const response = `Echo: ${message.text.body}`;
                    console.log('Sending echo response:', response);
                    await whatsappService.sendMessage(message.from, response, message.id);
                    
                }
                await whatsappService.markAsRead(message.id);
        }
        
    }
    isGreeting(message) {
        const greetingMessages = ['hi', 'hello', 'hey', 'hola', 'hi there', 'hello there', 'hey there', 'hola there'];
        return greetingMessages.includes(message);
    }

    async sendWelcomeMessage(to, message_id) {
        const welcomeMessage = 'Welcome to the Bellaluna family!' + 'how can I help you today?';
        await whatsappService.sendMessage(to, welcomeMessage, message_id);
        
    }
}

export default new MessageHandler();