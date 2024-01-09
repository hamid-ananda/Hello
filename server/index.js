require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const groupRoutes = require("./routes/chats");
const messageRoutes = require("./routes/messaging");
const friendRoutes = require("./routes/friends");
const authRoutes = require("./routes/auth");
const passwordReset = require("./routes/passwordReset");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // or your client's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Update this to your client's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordReset);
app.use("/api/chat", groupRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friends", friendRoutes);

// Video and RPS functionality
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/getio");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });

  // RPS functionality
  socket.on('createGame', () => {
    const roomUniqueId = makeid(6);
    rooms[roomUniqueId] = {};
    socket.join(roomUniqueId);
    socket.emit("newGame", {roomUniqueId: roomUniqueId});
  });

  socket.on('joinGame', (data) => {
    if(rooms[data.roomUniqueId] != null) {
      socket.join(data.roomUniqueId);
      socket.to(data.roomUniqueId).emit("playersConnected", {});
      socket.emit("playersConnected");
    }
  });

  socket.on("p1Choice",(data)=>{
    let rpsValue = data.rpsValue;
    rooms[data.roomUniqueId].p1Choice = rpsValue;
    socket.to(data.roomUniqueId).emit("p1Choice",{rpsValue : data.rpsValue});
    if(rooms[data.roomUniqueId].p2Choice != null) {
      declareWinner(data.roomUniqueId);
    }
  });

  socket.on("p2Choice",(data)=>{
    let rpsValue = data.rpsValue;
    rooms[data.roomUniqueId].p2Choice = rpsValue;
    socket.to(data.roomUniqueId).emit("p2Choice",{rpsValue : data.rpsValue});
    if(rooms[data.roomUniqueId].p1Choice != null) {
      declareWinner(data.roomUniqueId);
    }
  });
});

// Tic Tac Toe (xo) functionality
const { PlayerJoined, PlayerLeaved, Playing } = require("./models/xo");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  PlayerJoined(io, socket);
  Playing(io, socket);

  socket.on("disconnect", () => {
    PlayerLeaved(io, socket);
  });
});

// RPS functionality
const rooms = {};

function declareWinner(roomUniqueId) {
  let p1Choice = rooms[roomUniqueId].p1Choice;
  let p2Choice = rooms[roomUniqueId].p2Choice;
  let winner = null;
  if (p1Choice === p2Choice) {
    winner = "d";
  } else if (p1Choice == "Paper") {
    if (p2Choice == "Scissor") {
      winner = "p2";
    } else {
      winner = "p1";
    }
  } else if (p1Choice == "Rock") {
    if (p2Choice == "Paper") {
      winner = "p2";
    } else {
      winner = "p1";
    }
  } else if (p1Choice == "Scissor") {
    if (p2Choice == "Rock") {
      winner = "p2";
    } else {
      winner = "p1";
    }
  }
  io.sockets.to(roomUniqueId).emit("result", {
    winner: winner
  });
  rooms[roomUniqueId].p1Choice = null;
  rooms[roomUniqueId].p2Choice = null;
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
