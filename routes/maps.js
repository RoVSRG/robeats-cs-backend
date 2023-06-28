const Map = require("../models/map")
const Difficulty = require("../models/difficulty")

module.exports = (fastify, opts, done) => {
    fastify.get("/", { preHandler: fastify.protected }, async (request, reply) => {
        const { hash } = request.query

        if (!hash)
            reply.status(400).send({ error: "Must provide hash" })

        const difficulties = await Difficulty.find({ SongMD5Hash: hash }, { Allowed: 0, SongMD5Hash: 0, _id: 0 }).sort("Rate")

        reply.send(difficulties)
    })

    fastify.get("/difficulty", async (request, reply) => {
        const closest = request.query.closest;

        if (!closest) {
            reply.send({ error: "No MMR specified" });
            return;
        }

        const sort = {
            $abs: {
                $subtract: [Number.parseFloat(closest), "$Rating"],
            },
        };

        const results = await Difficulty.aggregate([
            {
                $match: {
                    Rate: { $ne: null },
                    Rating: { $ne: null },
                    RD: { $ne: null },
                    Sigma: { $ne: null },
                }
            },
            {
                $project: {
                    diff: sort,
                    doc: "$$ROOT",
                },
            },
            { $sort: { diff: 1 } },
            { $limit: 150 },
            { $replaceRoot: { newRoot: "$doc" } }, // Include all fields from the original documents
        ]);

        reply.send(results);

    })

    fastify.post("/", { preHandler: fastify.protected }, async (request, reply) => {
        reply.send("Not implemented!")
    })

    fastify.delete("/difficulty", { preHandler: fastify.protected }, async (request, reply) => {
        const result = await Difficulty.deleteMany({ SongMD5Hash: request.query.hash })

        reply.send(`${result.deletedCount} maps deleted`)
    })

    done()
}