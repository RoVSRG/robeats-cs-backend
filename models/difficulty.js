const { Schema, model } = require("mongoose")

const Difficulty = new Schema({
    SongMD5Hash: String,
    Rate: Number,
    Rating: Number,
    RD: Number,
    Sigma: Number,
    Allowed: { type: Boolean, default: true }
})

module.exports = model("Difficulty", Difficulty, "Difficulties")
