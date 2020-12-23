const Play = require('../models/play');
const Profile = require('../models/profile')

const PlayerAPI = require('../api/player')
const PlayerMetrics = require('../metrics/player')

class ScoreAPI {
    async submitScore(data) {
        var score = await Play.findOne({ UserId: data.UserId, MapId: data.MapId })
        var createNew = score == null;
        var shouldOverwrite = false;

        if ((data != null) & (data.Rating >= 0) & (createNew == false)) {
            if (data.Rating != 0) {
                shouldOverwrite = score.Rating < data.Rating;
            } else {
                shouldOverwrite = score.Score < data.Score;
            }
        }

        console.log({"createNew": createNew, "shouldOverwrite": shouldOverwrite, "score": score})

        if (createNew) {
            score = new Play({
                "PlayerName": data.PlayerName,
                "UserId": data.UserId,
                "MapId": data.MapId,
                "MapName": data.MapName,
                "Accuracy": data.Accuracy,
                "Score": data.Score,
                "Spread": data.Spread,
                "Rate": data.Rate,
                "Rating": data.Rating
            })
            score.save()
        } else if (shouldOverwrite) {
            score.PlayerName = data.PlayerName
            score.UserId = data.UserId
            score.MapId = data.MapId
            score.MapName = data.MapName
            score.Accuracy = data.Accuracy
            score.Score = data.Score
            score.Spread = data.Spread
            score.Rate = data.Rate
            score.Rating = data.Rating
            score.save()
        }
    }

    async updateProfile(data) {
        const plays = await Play.find({"UserId": data.UserId}).sort("-Rating")

        const rating = await PlayerMetrics.getRating(plays)

        await Profile.findOneAndUpdate({"UserId": data.UserId}, {
            "PlayerName": data.PlayerName,
            "Rating": rating,
            $inc: {
                "TotalMapsPlayed": 1
            },
            "UserId": data.UserId
        }, {
            new: true,
            upsert: true,
            useFindAndModify: false
        })

        const rank = await PlayerAPI.getRank(data.UserId)

        return {
            rank: rank,
            rating: rating
        }
    }
}

module.exports = new ScoreAPI()