const express = require("express");
var app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/robeatscsdb', {useNewUrlParser: true, useUnifiedTopology: true});

const apiRouters = require("./api")

const api_key = "";

function verifyUser(key_provided) {
  return true;
  if (key_provided) {
    if (key_provided == api_key) {
      return true;
    }
    return false;
  }
}

// TOP LEVEL APP USES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

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

//app.use("/api", apiRouters.scoreApi)

//LISTEN
app.listen(8080, async () => {
  console.log("Server started listening on port " + 8080);
});
