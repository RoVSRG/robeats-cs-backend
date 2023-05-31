const { difficultyToMMR } = require("../utils")

const DEFAULT_MMR = 1500

const { Schema, model } = require("mongoose")

const Rating = new Schema({
    Overall: { type: Number, default: 0 },
    Chordjack: { type: Number, default: 0 },
    Handstream: { type: Number, default: 0 },
    Jack: { type: Number, default: 0 },
    Jumpstream: { type: Number, default: 0 },
    Stamina: { type: Number, default: 0 },
    Stream: { type: Number, default: 0 },
    Technical: { type: Number, default: 0 },
})

const schema = new Schema({
    TotalMapsPlayed: { type: Number, default: 0 },
    Rating: Rating,
    PlayerName: String,
    UserId: Number,
    Accuracy: { type: Number, default: 0 },
    CountryRegion: String,
    GlickoRating: { type: Number, default: function() {
        if (this.TotalMapsPlayed < 20 || !this.Rating) {
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
    Allowed: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" }
})

module.exports = model("Profile", schema, "Global")
