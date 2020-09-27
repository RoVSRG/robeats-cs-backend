const router = require('express').Router();

const Play = require('../models/play');

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

  const query = Play.find({"UserId": userID});
  query.sort("-Rating");
  query.lean();
  query.limit(50);
  const results = await query.exec();

  console.log(results.length)

  res.send(results)
});

router.get("/maps/:id", async (req, res) => {
    var params = req.params;
    var mapID = params.id

    const query = Play.find({"MapId": mapID});
    query.sort("-Rating");
    query.lean();
    query.limit(50);
    const results = await query.exec();

    console.log(results.length)

    res.send(results)
});

/*router.post("/submitscore", async (req, res) => {
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
      await Play.insertOne(newPlayData);
    } else if (shouldOverwrite) {
      await Play.findOneAndReplace(query, newPlayData);
    }
    res.status(200).json({});
});*/

module.exports = router;
