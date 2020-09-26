const mongoose = require('mongoose')

const playSchema = new mongoose.Schema({
    Rating: Number,
    MapName: String,
    Rate: Number,
    Spread: String,
    MapId: String,
    PlayerName: String,
    UserId: String,
    Accuracy: Number,
    Score: Number
});

module.exports = mongoose.model("PlayerPlays", playSchema, "PlayerPlays");
