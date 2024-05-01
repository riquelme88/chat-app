import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import router from './routes/router'
import mustache from 'mustache-express'
import { Server } from 'socket.io';
import http from 'http'
import https from 'https'
import { PrismaClient } from '@prisma/client'
import passport from 'passport'
import fs from 'fs'

const prisma = new PrismaClient()

const app = express()
let io: any

dotenv.config();

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'mustache')
app.set('views', path.join(__dirname, 'views'));
app.engine('mustache', mustache());

app.use(passport.initialize())

app.use('/', router)


const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`Running at PORT ${port}`)
    })
}
const regularServer = http.createServer(app)
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string)
    }
    const secServer = https.createServer(options, app)
    io = new Server(secServer)
    runServer(80, regularServer)
    runServer(443, secServer)
} else {
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000
    runServer(serverPort, regularServer);
    io = new Server(regularServer)
}

let connectedUsers: string[] = []
let userOut = ''

io.on('connection', (socket: any) => {
    console.log('Detected connection in socket...');

    socket.on('join-request', async (username: any) => {
        socket.username = username
        let user = await prisma.user.findFirst({ where: { email: username } })
        username = user?.name
        userOut = username
        connectedUsers.push(username)
    })

    socket.username = userOut

    socket.emit('user-ok', {
        userMain: userOut,
        list: connectedUsers
    })

    socket.broadcast.emit('list-update', {
        list: connectedUsers,
        joined: userOut
    });

    socket.on('send-message', (txt: string) => {
        let obj = {
            username: socket.username,
            message: txt
        };


        socket.emit('show-message-me', obj)
        socket.broadcast.emit('show-message', obj)
    })

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user != socket.username)

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        })
    })
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status)
    } else {
        res.status(400)
    }

    if (err.message) {
        res.json({ status: err.message })
    } else {
        console.log('aconteceu algum erro')
    }
}
app.use(errorHandler)