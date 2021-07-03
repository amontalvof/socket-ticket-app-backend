const TicketList = require('./ticket-list');
class Sockets {
    constructor(io) {
        this.io = io;
        this.ticketList = new TicketList();
        this.socketsEvents();
    }

    socketsEvents() {
        // On connection
        this.io.on('connection', (socket) => {
            console.log('Client connected!', socket.id);

            socket.on('request-ticket', (_, callback) => {
                const newTicket = this.ticketList.createTicket();
                callback(newTicket);
            });

            socket.on('work-next-ticket', ({ agent, desk }, callback) => {
                const yourTicket = this.ticketList.assignTicket(agent, desk);
                callback(yourTicket);

                this.io.emit('assigned-ticket', this.ticketList.last13);
            });
        });
    }
}

module.exports = Sockets;
