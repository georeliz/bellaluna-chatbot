


export default {
  port: process.env.PORT || 3000,
  verifyToken: process.env.VERIFY_TOKEN,
  apiToken: process.env.API_TOKEN,
  apiVersion: process.env.API_VERSION,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
  agentPhoneNumber: process.env.AGENT_PHONE_NUMBER || null, // Número del agente en formato internacional (ej: 50212345678)
};
