const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const database = require("./config/database");

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
// app.use(cors);
database();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/helloworld", (request, response) => {
  response.send("Hello World");
});
