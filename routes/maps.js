const Map = require("../models/map")
const Difficulty = require("../models/difficulty")

module.exports = (fastify, opts, done) => {
    fastify.get("/", { preHandler: fastify.protected }, async (request, reply) => {
        const { hash, page } = request.query

        if (hash) {
            reply.send(await Map.findOne({ AudioMD5Hash: hash }))
        } else if (page) {
            reply.send(await Map.find({}).limit(50).skip(50 * (page - 1)))
        }
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
            { $limit: 30 },
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