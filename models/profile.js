const { Schema, model } = require("mongoose")

const Rating = new Schema({
    Overall: Number,
    Chordjack: Number,
    Handstream: Number,
    Jack: Number,
    Jumpstream: Number,
    Stamina: Number,
    Stream: Number,
    Technical: Number,
})

const schema = new Schema({
    TotalMapsPlayed: Number,
    Rating: Rating,
    PlayerName: String,
    UserId: Number,
    Accuracy: Number,
    CountryRegion: String,
    GlickoRating: { type: Number, default: 1500 },
    RD: { type: Number, default: 350 },
    Sigma: { type: Number, default: 0.06 },
    WinStreak: { type: Number, default: 0 },
    RankedMatchesPlayed: { type: Number, default: 0 },
    Wins: { type: Number, default: 0 },
    Allowed: Boolean
}, {
    timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" }
})

module.exports = model("Profile", schema, "Global")
