const { Schema, model } = require("mongoose")

const schema = new Schema({
    _id: String,
    Bads: Number,
    Rating: Number,
    Mean: Number,
    Perfects: Number,
    Rate: Number,
    Greats: Number,
    Misses: Number,
    Goods: Number,
    Accuracy: Number,
    UserId: Number,
    MaxChain: Number,
    PlayerName: String,
    Marvelouses: Number,
    Score: Number,
    SongMD5Hash: String,
    Allowed: Boolean,
    Mods: [Number]
}, {
    timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" }
})

module.exports = model("Play", schema, "Plays")
