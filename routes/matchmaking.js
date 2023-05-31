const Match = require("../models/match")
const Profile = require("../models/profile")
const Difficulty = require("../models/difficulty")

const axios = require("axios")

const { MatchResult, Period, Player, Rating } = require("go-glicko")

const TAU = 0.6

module.exports = (fastify, opts, done) => {
    fastify.get("/", (request, reply) => {
        reply.send({})
    })

    fastify.post("/result", async (request, reply) => {
        if (!request.query.userid || !request.query.hash || !request.query.result || !request.query.rate || !request.query.countrycode) {
            reply.send("Must provide userid, hash, rate, country code, and result")
            return
        }

        const userId = Number.parseInt(request.query.userid)
        let user = await Profile.findOne({ UserId: userId })

        if (!user) {
            const { data } = await axios.get(`https://users.roblox.com/v1/users/${request.query.userid}`)

            user = new Profile({
                PlayerName: data.name,
                UserId: userId,
                CountryRegion: request.query.countrycode
            })

            await user.save()
        }

        const rate = Number.parseInt(request.query.rate)

        const maps = await Difficulty.find({ Rate: request.query.result === "win" ? { $lte: rate } : { $gte: rate }, SongMD5Hash: request.query.hash })
        const map = request.query.result === "win" ? maps[maps.length - 1] : maps[0]

        const period = new Period(TAU)

        // the dummy player is used to calc maps on rates the user didnt play
        const dummyPlayer = new Player(new Rating(user.GlickoRating, user.RD, user.Sigma))
        const userPlayer = new Player(new Rating(user.GlickoRating, user.RD, user.Sigma))
        const mapPlayer = new Player(new Rating(map.Rating, map.RD, map.Sigma))

        period.addPlayer(userPlayer)
        period.addPlayer(mapPlayer)

        period.addMatch(userPlayer, mapPlayer, request.query.result === "win" ? MatchResult.WIN : MatchResult.LOSS)

        period.Calculate()

        // update user player

        const winstreak = request.query.result === "win" ? Math.max(user.WinStreak, 0) + 1 : Math.min(user.WinStreak, 0) - 1

        await Profile.updateOne({ UserId: userId }, {
            GlickoRating: userPlayer.Rating().R(),
            RD: userPlayer.Rating().RD(),
            Sigma: userPlayer.Rating().Sigma(),
            $inc: { RankedMatchesPlayed: 1, Wins: request.query.result === "win" ? 1 : 0 },
            WinStreak: winstreak
        })

        // update map players
        const mapPlayerPeriod = new Period(TAU)

        const mapPlayers = maps.map(m => {
            return new Player(new Rating(m.Rating, m.RD, m.Sigma))
        })

        mapPlayers.forEach(m => mapPlayerPeriod.addPlayer(m))

        mapPlayers.forEach(mp => mapPlayerPeriod.addMatch(dummyPlayer, mp, request.query.result === "win" ? MatchResult.WIN : MatchResult.LOSS))

        mapPlayerPeriod.Calculate()

        for (let i = 0; i < maps.length; i++) {
            const map = maps[i]
            const mapPlayer = mapPlayers[i]

            await Difficulty.updateOne({ SongMD5Hash: map.SongMD5Hash, Rate: map.Rate }, {
                Rating: mapPlayer.Rating().R(),
                RD: mapPlayer.Rating().RD(),
                Sigma: mapPlayer.Rating().Sigma()
            })
        }

        reply.send(await Profile.findOne({ UserId: userId }))
    })

    done()
}