const path = require('path');
const cors = require('cors');
const colors = require('colors/safe');
// Express Server
const express = require('express');
// HTTP Server
const http = require('http');
// Socket Server
const socketIo = require('socket.io');
const Sockets = require('./sockets');

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        // Initialize Sockets
        this.sockets = new Sockets(this.io);
    }

    middlewares() {
        // Display the public directory
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        // CORS
        this.app.use(cors());
        // GET last tickets
        this.app.get('/lastTickets', (req, res) => {
            res.json({
                ok: true,
                lastTickets: this.sockets.ticketList.last13,
            });
        });
    }

    execute() {
        //Initialize Middlewares
        this.middlewares();
        //Initialize Server
        this.server.listen(this.port, () => {
            console.log(colors.cyan(`Server running on port ${this.port}`));
        });
    }
}

module.exports = Server;
