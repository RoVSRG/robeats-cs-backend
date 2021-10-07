const express = require("express");
const cors = require("cors");

var app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const authInfo = require("./auth.json")

const useLocalDev = false

const uri = useLocalDev && authInfo.localDatabaseUri || authInfo.databaseUri;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const apiRouters = require("./routers")

const api_key = authInfo.authKey;

const verifyUser = (key_provided) => {
  if (key_provided) {
    if (key_provided == api_key) {
      return true;
    }
    return false;
  }
}

// DDOS

const ddos = require("ddos");
let ddosInst = new ddos({burst:80, limit:120})

// TOP LEVEL APP USES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(ddosInst.express)
app.use(cors())

app.use("/*", (req, res, next) => {
  var verified = verifyUser(req.get("auth-key"));
  if (!verified) {
    res.json({"error": "not authorized"})
    return;
  }
  next();
})

app.use((req, res, next) => {
  console.log("Request sent!");
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
app.use("/api", apiRouters.profileApi)

//LISTEN
app.listen(8080, async () => {
  console.log("Server started listening on port " + 8080);
});
