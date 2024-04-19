import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  mongo_url: process.env.MONGODB_URI,
};

// TODO: We do like this, so by accident no one will be able to modify the _config objext
export const config = Object.freeze(_config);