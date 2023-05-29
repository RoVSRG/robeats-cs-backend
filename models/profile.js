const { difficultyToMMR } = require("../utils")

const DEFAULT_MMR = 1500

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
    GlickoRating: { type: Number, default: function() {
        if (this.TotalMapsPlayed < 20) {
            return DEFAULT_MMR
        } else {
            const rawMMR = difficultyToMMR(this.Rating.Overall)

            return DEFAULT_MMR + (rawMMR - DEFAULT_MMR) * 0.75
        }
    } },
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
