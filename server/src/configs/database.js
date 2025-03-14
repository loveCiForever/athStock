// ./server/src/configs/database.js

import mongoose from "mongoose";
import "dotenv/config";
const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_CONNECTION_STRING, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // autoIndex: true,
    });
    console.log(`[DATABASE.js] Successfully connected to MongoDB`);
  } catch (error) {
    console.log("[DATABASE.js] Unable to connect to MongoDB! ", error);
  }
};

export default ConnectDatabase;
