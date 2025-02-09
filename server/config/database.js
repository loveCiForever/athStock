const mongoose = require("mongoose");
const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
require("dotenv").config();

async function DatabaseConnect() {
  mongoose
    .connect(DATABASE_CONNECTION_STRING, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
    })
    .then(() => {
      console.log(
        `Successfully connected to MongoDB Compass on ${DATABASE_CONNECTION_STRING}`
      );
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Compass!");
      console.error(error);
    });
}

module.exports = DatabaseConnect;
