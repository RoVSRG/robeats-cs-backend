const mongoose = require('mongoose')

const playSchema = new mongoose.Schema({
    PlayerName: String,
    UserId: String,
    Rating: Number,
    TotalMapsPlayed: Number
});

module.exports = mongoose.model("GlobalLeaderboard", playSchema, "GlobalLeaderboard");
