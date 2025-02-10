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
    console.log(`Successfully connected to MongoDB`);
  } catch (error) {
    console.log("Unable to connect to MongoDB!");
    console.error(error);
  }
};

export default ConnectDatabase;
