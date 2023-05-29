const Profile = require("../models/profile")

module.exports = (fastify, opts, done) => {
    fastify.get("/", { preHandler: fastify.protected }, async (request, reply) => {
        const profile = await Profile.findOne({ "UserId": Number.parseInt(request.query.userid) })

        if (!profile?.Rating) {
          reply.code(404).send({ error: "Profile not found" })
          return
        }

        const rank = profile ? (await Profile.countDocuments({ "Rating.Overall": { $gt: profile.Rating.Overall }, "Allowed": true })) + 1 : undefined

        reply.send({
          Rank: rank,
          ...profile?.toObject()
        })
    })

    fastify.get("/top", { preHandler: fastify.protected }, async (request, reply) => {
      let query = { Allowed: true }

      if (request.query.country) {
        query.CountryRegion = request.query.country
      }

      const players = await Profile.find(query).sort("-GlickoRating").limit(100)

      reply.send(players)
    })

    done()
}