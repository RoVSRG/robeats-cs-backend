const router = require('express').Router();

const Profile = require('../models/profile');


router.get("/profile/:id", async (req, res) => {
  var params = req.params;
  var userID = params.id

  const query = Profile.find({"UserId": userID});
  query.lean();
  query.limit(1);
  const results = await query.exec();
  res.send(results)
});

router.get("/profile/:name", async (req, res) => {
  var params = req.params;
  var username = params.name

  const query = Profile.find({"PlayerName": username});
  query.lean();
  query.limit(1);
  const results = await query.exec();
  res.send(results)
});

module.exports = router;
