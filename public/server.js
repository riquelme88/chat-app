"use strict";
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
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
dotenv_1.default.config();
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'mustache');
app.set('views', path_1.default.join(__dirname, 'views'));
app.engine('mustache', (0, mustache_express_1.default)());
app.use('/', router_1.default);
io.on('connection', (socket) => {
    console.log('Detected connection in socket...');
});
server.listen(process.env.PORT);
