const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

// Serve the index.html file
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);

    // Save the message to the database
    // (You can customize this part based on your data model and database structure)

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
