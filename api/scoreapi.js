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

router.post("/submitscore", async (req, res) => {
    var body = req.body;
    // SUBMISSION
    var score = await Play.findOne({ UserId: body.UserId, MapId: body.MapId })
        // submit the score
    var createNew = score == null;
    var shouldOverwrite = false;

    if ((score != null) & (body.Rating >= 0)) {
      if (score.Rating != 0) {
        shouldOverwrite = score.Rating < body.Rating;
      } else {
        shouldOverwrite = score.Score < body.Score;
      }
    }

    console.log({createNew: createNew, shouldOverwrite: shouldOverwrite, score: score})

    if (createNew) {
      score = new Play({
        PlayerName: body.PlayerName,
        UserId: body.UserId,
        MapId: body.MapId,
        MapName: body.MapName,
        Accuracy: body.Accuracy,
        Score: body.Score,
        Spread: body.Spread,
        Rate: body.Rate,
        Rating: body.Rating
      })
      score.save()
    } else if (shouldOverwrite) {
      score.PlayerName = body.PlayerName
      score.UserId = body.UserId
      score.MapId = body.MapId
      score.MapName = body.MapName
      score.Accuracy = body.Accuracy
      score.Score = body.Score
      score.Spread = body.Spread
      score.Rate = body.Rate
      score.Rating = body.Rating
      score.save()
    }

    res.json(score.toJSON())
});

module.exports = router;
