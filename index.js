const fs = require("fs")
const cors = require("@fastify/cors")

try {
    fs.mkdirSync("replays")
} catch {}

const fastify = require('fastify')({
    logger: true
})

fastify.decorate("protected", (request, reply, done) => {
    if (request.query.auth == process.env.rcsauth) {
        done()
    } else {
        reply.status(401).send({status: "Unauthorized"})
    }
})

let connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

if (process.env.rcsdb?.match("127.0.0.1") == null && process.env.rcsdb?.match("localhost") == null) {
    connectOptions.ssl = true
    connectOptions.sslCA = "./ca-certificate.crt"
}

let connectionString = process.env.rcsdb || "mongodb://127.0.0.1:27017/dev"

if (connectionString.includes("127.0.0.1")) {
    delete connectOptions.ssl
    delete connectOptions.sslCA
}

console.log(connectOptions)

const mongoose = require("mongoose")
mongoose.connect(connectionString, connectOptions).catch(err => console.log(err))

fastify.get("/", (request, reply) => {
    reply.type('text/html').send("<img src=\"https://forklores.files.wordpress.com/2012/11/pinto-beans-and-cornbread-3.jpg?w=663&h=501\"/>")
})

fastify.register(require("./routes/scores"), { prefix: "/api/scores" })
fastify.register(require("./routes/profiles"), { prefix: "/api/profiles" })
fastify.register(require("./routes/bans"), { prefix: "/api/bans" })
fastify.register(require("./routes/matchmaking"), { prefix: "/api/matchmaking" })
fastify.register(require("./routes/difficulties"), { prefix: "/api/difficulties" })
fastify.register(require("./routes/maps"), { prefix: "/api/maps" })

fastify.register(cors)

// fastify.listen(process.env.port ? Number.parseInt(process.env.port) : 3000, function (err, address) {
//     if (err) {
//         fastify.log.error(err)
//         process.exit(1)
//     }
// })

fastify.listen({ port: process.env.rcsport ? Number.parseInt(process.env.rcsport) : 3000 }, (err, address) => {
    if (!err) return;
    fastify.log.error(err)
    process.exit(1)
})