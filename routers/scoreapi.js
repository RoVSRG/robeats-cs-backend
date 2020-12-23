const router = require('express').Router();

const ScoreAPI = require('../api/score')

router.get("/plays/id/:id", async (req, res) => {
  var params = req.params;
  var userID = params.id

  const query = Play.find({"UserId": userID});
  query.sort("-Rating");
  query.lean();
  query.limit(50);
  const results = await query.exec();
  res.send(results)
});

router.get("/play/:id", async (req, res) => {
  var params = req.params;
  var playid = params.id

  const query = Play.find({"_id": playid});
  query.lean();
  query.limit(1);
  const results = await query.exec();
  res.send(results)
});

router.get("/plays/:name", async (req, res) => {
  var params = req.params;
  var username = params.name

  const query = Play.find({"PlayerName": username});
  query.sort("-Rating");
  query.lean();
  query.limit(50);
  const results = await query.exec();
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
    res.send(results)
});

router.post("/deletescore/:id", async (req, res) => {
    var params = req.params;
    var playid = params.id

    Play.findByIdAndDelete(playid)
    res.send(results)
});

router.post("/submitscore", async (req, res) => {
    var body = req.body;
    // SUBMISSION

    await ScoreAPI.submitScore(body)
    const rank = await ScoreAPI.updateProfile(body)

    res.json({
      rank: rank
    })
});

module.exports = router;
