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
    }

    middlewares() {
        // Display the public directory
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        // CORS
        this.app.use(cors());
    }

    socketsConfiguration() {
        new Sockets(this.io);
    }

    execute() {
        //Initialize Middlewares
        this.middlewares();
        // Initialize Sockets
        this.socketsConfiguration();
        //Initialize Server
        this.server.listen(this.port, () => {
            console.log(colors.cyan(`Server running on port ${this.port}`));
        });
    }
}

module.exports = Server;
