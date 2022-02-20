const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

// @event : New connection to server
io.on('connection', (socket) => {
    console.log('New socket connection');

    // @event : Adding the user and socket to the list
    socket.on('addUser', userId => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    })

    // @event : Send and get private message
    socket.on('sendMessage', ({ senderId, recvId, text }) => {
        console.log('Message sending');
        const user = getUser(recvId);
        io.to(user.socketId).emit('getMessage', { senderId, text });
    });

    // @event : User disconnected
    socket.on('disconnect', () => {
        console.log('User disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})