const express = require("express");
var app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const useLocalHost = false;

const uri = "mongodb://robeatscsgame:%24uper%24ecretThing%24@robeatscsgame.com:27017/robeatscsdb";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const apiRouters = require("./api")

const api_key = "HCQVcEs2NZdaMvJhDXJPdbR1l3Wy45h5QdLSZNXtN6ouU";

function verifyUser(key_provided) {
  if (key_provided) {
    if (key_provided == api_key) {
      return true;
    }
    return false;
  }
}

// DDOS

const ddos = require("ddos");
let ddosInst = new ddos({burst:15, limit:25})

// TOP LEVEL APP USES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(ddosInst.express)

app.use("/*", (req, res, next) => {
  var verified = verifyUser(req.get("auth-key"));
  if (!verified) {
    res.json({"error": "not authorized"})
    return;
  }
  next();
})

app.get("/stats", async (req, res) => {
  res.json({})
});

app.get('/', (req, res) => {
	res.json({"yup": "it works"})
});

app.get("/global", async (req, res) => {
  res.json({});
});

app.get("/settings", async (req, res) => {
  
});

// MOUNT ROUTERS

app.use("/api", apiRouters.scoreApi)

//LISTEN
app.listen(8080, async () => {
  console.log("Server started listening on port " + 8080);
});
