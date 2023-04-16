const { Schema, model } = require("mongoose")

const Map = new Schema({
    AudioArtist: String,
    AudioAssetId: String,
    AudioCoverImageAssetId: String,
    AudioDescription: String,
    AudioFilename: String,
    AudioHitSFXGroup: String,
    AudioMapper: String,
    AudioMod: Number,
    AudioNotePrebufferTime: Number,
    AudioTimeOffset: Number,
    AudioVolume: Number,
    AudioMD5Hash: String,
})

module.exports = model("Map", Map, "Maps")
