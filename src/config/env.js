
import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  verifyToken: process.env.VERIFY_TOKEN,
  apiToken: process.env.API_TOKEN,
  apiVersion: process.env.API_VERSION,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
};
