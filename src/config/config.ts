import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/quotes_db',
  port: process.env.PORT || 5000,
  fav_api_key: process.env.FAVQS_API_KEY,
  fav_api_url: process.env.API_URL,
};
