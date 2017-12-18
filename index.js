const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

// DB SETUP
mongoose.connect("mongodb://localhost:auth/auth");


// App Setup Middleware

// morgan logs incoming requests to server terminal, used for debugging
app.use(morgan('combined'));
// body-parser parses incoming requests, in this instance, it parses into JSON
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup (getting server to talk to outside world)
const PORT = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(PORT);
console.log("Server listening on Port: ", PORT);


