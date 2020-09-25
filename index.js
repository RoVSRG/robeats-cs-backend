var RequestTicketNumber = 0;

const express = require("express");
var app = express();
const bodyParser = require("body-parser");
//CONNECTION STRING
const uri = "mongodb://localhost:27017";
//API KEY FOR CLIENTS
const api_key = null;
function verifyUser(key_provided) {
  return true;
  if (key_provided) {
    if (key_provided == api_key) {
      return true;
    }
    return false;
  }
}
//MONGO CLIENT
const mongodb = require("mongodb").MongoClient;
var client = null; //new mongodb(uri, { useNewUrlParser: true , useUnifiedTopology: true});
var DB = null;
var Plays = null;


mongodb.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 170 },
  async (err, cli) => {
    if (err) {
      console.log("Error connecting to MongoDB Client: " + err);
      return null;
    }
    client = cli;
    DB = await client.db("robeatscsdb");
    Plays = DB.collection("PlayerPlays");
  }
);
// SETTINGS
const numberOfGLBSlots = 100;
const numberOfMLBSlots = 50;
const numOfPlaysToCalc = 25;
//APP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// FUNCTIONS

async function getRating(promise) {
  var rating = 0;
  await promise.toArray().then(topScores => {
    var maxNumOfScores = 25;
    for (var i = 0; i < maxNumOfScores; i++) {
      if (topScores[i] != null) {
        if (i <= 10) {
          rating = rating + topScores[i].Rating * 1.5;
        } else {
          rating = rating + topScores[i].Rating;
        }
      }
    }
  });
  var plr_rating = Math.floor((100 * rating) / 30) / 100;
  return plr_rating;
}

// TEMPLATE ENDPOINT
/*
app.get('/', (req, res) => {
	
});
*/
//ENDPOINTS

app.get("/stats", async (req, res) => {
  res.json({})
});

app.get('/', (req, res) => {
	
});

app.get("/global", async (req, res) => {
  res.json({});
});

app.get("/plays/:id", async (req, res) => {
  var verified = verifyUser(req.get("auth-key"));
  if (!verified) {
    console.log(
      "Unauthenticated request occured from IP address " +
        req.ip +
        " to TopPlays."
    );
    res
      .status(401)
      .send({error: "nice one"});
  } else {
    var params = req.params;
    var userID = params.id
    Plays.find({ UserId: userID })
      .sort({ Rating: -1 })
      .toArray()
      .then(async doc_r => {
        res.status(200).json(doc_r);
      })
      .catch(err => {
        console.log("Oh no! A request failed! Here is some info: " + err);
        return err;
      })
      .finally(err => {
        if (err != null) {
          res
            .status(500)
            .send("We failed you <:O | So sorry! Here is some info: " + err);
        }
      });
  }
});

app.get("/maps/:id", async (req, res) => {
  var verified = verifyUser(req.get("auth-key"));
  if (!verified) {
    console.log(
      "Unauthenticated request occured from IP address " +
        req.ip +
        " to TopPlays."
    );
    res
      .status(401)
      .send({error: "nice one"});
  } else {
    var params = req.params;
    var mapID = params.id
    Plays.find({ MapId: mapID })
      .sort({ Rating: -1 })
      .limit(50)
      .toArray()
      .then(async doc_r => {
        res.status(200).json(doc_r);
      })
      .catch(err => {
        console.log("Oh no! A request failed! Here is some info: " + err);
        return err;
      })
      .finally(err => {
        if (err != null) {
          res
            .status(500)
            .send("We failed you <:O | So sorry! Here is some info: " + err);
        }
      });
  }
});

app.get("/settings", async (req, res) => {
  
});

app.post("/submitscore", async (req, res) => {
  var verified = verifyUser(req.get("auth-key"));
  var rating = 0;
  var rank = 0;
  if (!verified) {
    console.log(
      "Unauthenticated request occured from IP address " +
        req.ip +
        " to /submitscore."
    );
    res
      .status(401)
      .send({"error": "very k00l br00o0o0oo0o0o"});
  } else {
    var newPlayData = req.body;
    console.log(newPlayData);
    var query = { UserId: newPlayData.UserId, MapId: newPlayData.MapId };
    // SUBMISSION
    Plays.findOne(query)
      .then(async doc => {
        // submit the score
        var createNew = doc == null;
        var shouldOverwrite = false;
        if ((doc != null) & (newPlayData.Rating >= 0)) {
          if (doc.Rating != 0) {
            shouldOverwrite = doc.Rating < newPlayData.Rating;
          } else {
            shouldOverwrite = doc.Score < newPlayData.Score;
          }
        }
        console.log(
          "createNew: " +
            createNew.toString() +
            ", shouldOverwrite: " +
            shouldOverwrite.toString()
        );
        if (createNew) {
          Plays.insertOne(newPlayData);
        } else if (shouldOverwrite) {
          Plays.findOneAndReplace(query, newPlayData);
        }
      })
      .catch(async err => {
        // catch any errors
        console.log("ERR: " + err);
        res
          .status(500)
          .send(
            "Whoops! Something went horribly wrong! Here's some info: " + err
          );
      })
      .then(async () => {
        // send stat data back
        console.log("end");
        res.status(200).json({});
      })
      .catch(async err => {
        console.log("ERR: " + err);
      });
  }
});

//LISTEN
app.listen(8080, async () => {
  console.log("Server started listening on port " + 8080);
});
