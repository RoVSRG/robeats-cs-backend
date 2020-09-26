const router = require('express').Router();

const mongoclient = require('../database');

const numberOfGLBSlots = 100;
const numberOfMLBSlots = 50;

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

router.get("/plays/:id", async (req, res) => {
    var params = req.params;
    var userID = params.id
    Plays.find({ UserId: userID }).sort({ Rating: -1 }).toArray().then(async doc_r => {
        res.status(200).json(doc_r);
    }).catch(err => {
        console.log("Oh no! A request failed! Here is some info: " + err);
        res.status(500).json({"error": "Internal Server Error"})
        return err;
    });
});

router.get("/maps/:id", async (req, res) => {
    var params = req.params;
    var mapID = params.id
    Plays.find({ MapId: mapID }).sort({ Rating: -1 }).limit(numberOfMLBSlots).toArray().then(async doc_r => {
        res.status(200).json(doc_r);
    }).catch(err => {
        console.log("Oh no! A request failed! Here is some info: " + err);
        res.status(500).json({"error": "Internal Server Error"})
        return err;
    });
});

router.post("/submitscore", async (req, res) => {
    var newPlayData = req.body;
    var query = { UserId: newPlayData.UserId, MapId: newPlayData.MapId };
    // SUBMISSION
    var doc = await Plays.findOne(query)
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
    if (createNew) {
      await Plays.insertOne(newPlayData);
    } else if (shouldOverwrite) {
      await Plays.findOneAndReplace(query, newPlayData);
    }
    res.status(200).json({});
});

module.exports = router;
