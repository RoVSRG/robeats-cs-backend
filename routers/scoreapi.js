const router = require('express').Router();

const ScoreAPI = require('../api/score')
const Play = require('../models/play')
const Profile = require('../models/profile')

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

router.delete("/profile/:name", async (req, res) => {
  var params = req.params;
  var name = params.name

  if (name == "*") {
    res.status(400).send({status: 400, success: false, message: "Invalid request"})  
  }

  await Profile.deleteOne({PlayerName: name})
  await Play.deleteMany({PlayerName: name});

  res.status(200).send({status: 200, success: true, message: `Successfully deleted all scores for user ${name}`})
})

router.delete("/score/:id", async (req, res) => {
    var params = req.params;
    var playid = params.id

    if (playid == "*") {
      res.status(400).send({status: 400, success: false, message: "Invalid request"})  
    }

    Play.findByIdAndDelete(playid)
    res.send(results)
});

router.post("/submitscore", async (req, res) => {
    var body = req.body;
    // SUBMISSION

    await ScoreAPI.submitScore(body)
    const data = await ScoreAPI.updateProfile(body)

    res.json(data)
});

module.exports = router;
