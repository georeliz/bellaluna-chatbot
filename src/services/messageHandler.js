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
                } else if(this.isMenuSelection(incomingMessage)){
                    console.log('Menu selection detected');
                    await this.handleMenuSelection(message.from, message.id, incomingMessage);
                } else {
                    const response = `Gracias por tu mensaje. Para acceder al menú principal, escribe "hola" o "menu" 😊`;
                    console.log('Sending default response:', response);
                    await whatsappService.sendMessage(message.from, response, message.id);
                }
                await whatsappService.markAsRead(message.id);
            } else if (message?.type === 'interactive') {
                const type = message?.interactive?.button?.id;
                await this.handleMenuSelection(message.from, type);
                await whatsappService.markAsRead(message.id);
            } 
        } catch (error) {
            console.error('Error processing message:', error);
            // No re-throw the error to prevent webhook failure
        }
    }
    isGreeting(message) {
        const greetingMessages = ['hi', 'hello', 'hey', 'hola', 'hi there', 'hello there', 'hey there', 'hola there', 'menu', 'menú'];
        return greetingMessages.includes(message);
    }

    isMenuSelection(message) {
        const menuSelections = ['1', '2', '3', '4', '5', '6', 'habitaciones', 'eventos', 'restaurante', 'ubicación', 'contacto', 'información'];
        return menuSelections.includes(message);
    }

    getSenderName(senderInfo){
        return senderInfo.profile?.name || senderInfo.wa_id;
    }

    async sendWelcomeMessage(to, message_id, senderInfo) {
        const name = this.getSenderName(senderInfo);
        const welcomeMessage = `¡Hola ${name}! 🏨\n\nBienvenido al Hotel Bella Luna en Quetzaltenango.\n\n"El descanso que mereces" 💫\n\n¿En qué puedo ayudarte hoy?`;
        await whatsappService.sendMessage(to, welcomeMessage, message_id);
        
    }

    async sendInteractiveList(to) {
        const header = '🏨 Hotel Bella Luna';
        const body = 'Selecciona el servicio que te interesa:';
        const footer = 'Tu descanso nos importa 💫';
        const button = 'Ver Opciones';
        const sections = [
            {
                id: '1',
                title: '🛏️ Habitaciones',
                description: 'Habitaciones cómodas y seguras',
            },
            {
                id: '2',
                title: '📅 Tarifas',
                description: 'Ver calendario y tarifas vigentes',
            },

            {
                id: '3',
                title: '🍽️ Restaurante',
                description: 'Deliciosos platillos del Jardín',
            },
            {
                id: '4',
                title: '📍 Ubicación',
                description: 'Km 196.5 Carretera Interamericana',
            },
            {
                id: '5',
                title: '🎉 Eventos',
                description: 'Salones para eventos sociales',
            },
            {
                id: '6',
                title: '💬 Hablar con asesor',
                description: 'Atención personalizada',
            },
        ];
        await whatsappService.sendInteractiveList(to, header, body, footer, button, sections);
    }

    async handleMenuSelection(to, type) {
        let response = '';
        
        switch(type) {
            case '1':
            case 'habitaciones':
                response = `🏠 *HABITACIONES DISPONIBLES*\n\n` +
                          `• Habitación Sencilla\n` +
                          `• Habitación Doble\n` +
                          `• Habitación Triple\n` +
                          `• Habitación Cuádruple\n` +
                          `• Suite Presidencial\n\n` +
                          `Todas nuestras habitaciones cuentan con:\n` +
                          `✅ Amplias y cómodas\n` +
                          `✅ Protocolo de higiene estricto\n` +
                          `✅ Máxima seguridad\n\n` +
                          `¿Te gustaría hacer una reservación? Escribe "reservar" 📞`;
                break;
                
            case '2':
            case 'tarifas':
            case 'disponibilidad':
                response = `📅 *TARIFAS Y DISPONIBILIDAD*\n\n` +
                          `Consulta nuestras tarifas por temporada:\n\n` +
                          `• Temporada Baja: Q250 - Q350\n` +
                          `• Temporada Media: Q350 - Q450\n` +
                          `• Temporada Alta: Q450 - Q650\n\n` +
                          `*Disponibilidad:*\n` +
                          `✅ Consulta en tiempo real\n` +
                          `✅ Reservas online\n` +
                          `✅ Cancelación flexible\n\n` +
                          `📞 *Reservas:*\n` +
                          `+502 7926 8123\n\n` +
                          `¿Te gustaría hacer una reservación?`;
                break;
                
            case '3':
            case 'restaurante':
                response = `🍽️ *RESTAURANTE EL JARDÍN*\n\n` +
                          `Disfruta de nuestros deliciosos platillos:\n\n` +
                          `• Cocina internacional\n` +
                          `• Ambiente acogedor\n` +
                          `• Servicio de primera\n\n` +
                          `¿Te gustaría ver nuestro menú? Escribe "menú" 📋`;
                break;
                
            case '4':
            case 'ubicación':
                response = `📍 *UBICACIÓN*\n\n` +
                          `🏨 *Hotel Bella Luna*\n` +
                          `Km 196.5 Carretera Interamericana\n` +
                          `Quetzaltenango, Guatemala\n\n` +
                          `*Ventajas de nuestra ubicación:*\n` +
                          `✅ A solo 10 minutos del centro\n` +
                          `✅ Cerca de centros comerciales\n` +
                          `✅ Acceso a rutas turísticas\n` +
                          `✅ Ambiente tranquilo y seguro\n\n` +
                          `¿Necesitas indicaciones? 🗺️`;
                break;
                
            case '5':
            case 'eventos':
                response = `🎉 *EVENTOS Y SALONES*\n\n` +
                          `Celebra con nosotros tu evento:\n\n` +
                          `• Eventos Sociales\n` +
                          `• Eventos Corporativos\n` +
                          `• Salones amplios y equipados\n\n` +
                          `📞 *Cotizaciones de Eventos:*\n` +
                          `+502 5710 0027\n\n` +
                          `¿Necesitas más información sobre eventos?`;
                break;
                
            case '6':
            case 'asesor':
            case 'contacto':
                response = `💬 *HABLAR CON UN ASESOR*\n\n` +
                          `Conecta con nuestros especialistas para atención personalizada:\n\n` +
                          `*Hotel:*\n` +
                          `📞 +502 7926 8123\n` +
                          `📞 +502 7926 8125\n` +
                          `📞 +502 7926 8129\n\n` +
                          `*Eventos:*\n` +
                          `📞 +502 5710 0027\n\n` +
                          `*Email:*\n` +
                          `📧 info@hotelbellaluna.com\n\n` +
                          `*Horario de Atención:*\n` +
                          `24 horas / 7 días a la semana\n\n` +
                          `¿En qué podemos ayudarte? 😊`;
                break;
                
            default:
                response = `No entendí tu selección. Por favor, escribe el número (1-6) o "hola" para ver el menú nuevamente. 😊`;
        }
        
        await whatsappService.sendMessage(to, response, messageId);
    }
}

export default new MessageHandler();