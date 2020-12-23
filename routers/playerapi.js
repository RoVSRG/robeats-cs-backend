const router = require('express').Router();

const Profile = require('../models/profile');

const PlayerAPI = require('../api/player')
const ScoreAPI = require('../api/score')


router.get("/profile/id/:id", async (req, res) => {
  var params = req.params;
  var userID = params.id

  const query = Profile.findOne({"UserId": userID});
  query.lean();
  query.limit(1);
  const results = await query.exec();

  if (results != null) {
    const rank = await PlayerAPI.getRank(userID)
    results.rank = rank
  }

  res.send(results)
});

router.get("/profile/:name", async (req, res) => {
  var params = req.params;
  var username = params.name

  const query = Profile.findOne({"PlayerName": username});
  query.lean();
  query.limit(1);
  const results = await query.exec();
  res.send(results)
});

router.get("/profile/rank/:id", async (req, res) => {
  var params = req.params;
  var userID = params.id
  
  res.send({
    rank: await PlayerAPI.getRank(userID)
  })
});

router.post("/profile/update/:id", async (req, res) => {
  const userID = req.params.id

  res.send(await ScoreAPI.updateProfile({
    UserId: userID
  }))
})

router.get("/global", async (req, res) => {
  const ranks = await ScoreAPI.getGlobalLeaderboard()
  res.send(ranks)
})

module.exports = router;
