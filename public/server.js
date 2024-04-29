"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./routes/router"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const userModel_1 = require("./model/userModel");
const passport_1 = __importDefault(require("passport"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
let io;
dotenv_1.default.config();
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'mustache');
app.set('views', path_1.default.join(__dirname, 'views'));
app.engine('mustache', (0, mustache_express_1.default)());
app.use(passport_1.default.initialize());
app.use('/', router_1.default);
const runServer = (port, server) => {
    server.listen(port, () => {
        console.log(`Running at PORT ${port}`);
    });
};
const regularServer = http_1.default.createServer(app);
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs_1.default.readFileSync(process.env.SSL_KEY),
        cert: fs_1.default.readFileSync(process.env.SSL_CERT)
    };
    const secServer = https_1.default.createServer(options, app);
    io = new socket_io_1.Server(secServer);
    runServer(80, regularServer);
    runServer(443, secServer);
}
else {
    const serverPort = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    runServer(serverPort, regularServer);
    io = new socket_io_1.Server(regularServer);
}
let connectedUsers = [];
let userOut = '';
io.on('connection', (socket) => {
    console.log('Detected connection in socket...');
    socket.on('join-request', (username) => __awaiter(void 0, void 0, void 0, function* () {
        socket.username = username;
        let user = yield userModel_1.User.findOne({ where: { email: username } });
        username = user === null || user === void 0 ? void 0 : user.name;
        userOut = username;
        connectedUsers.push(username);
    }));
    socket.username = userOut;
    socket.emit('user-ok', {
        userMain: userOut,
        list: connectedUsers
    });
    socket.broadcast.emit('list-update', {
        list: connectedUsers,
        joined: userOut
    });
    socket.on('send-message', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        };
        socket.emit('show-message-me', obj);
        socket.broadcast.emit('show-message', obj);
    });
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user != socket.username);
        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });
});
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status);
    }
    else {
        res.status(400);
    }
    if (err.message) {
        res.json({ status: err.message });
    }
    else {
        console.log('aconteceu algum erro');
    }
};
app.use(errorHandler);
