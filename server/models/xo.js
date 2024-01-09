let xo = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currPlayer = "X";
let winner = "";
let players = [];
//let rooms = [];

PlayerJoined = (io, socket) => {
  const id = socket.id;
  if (players.indexOf(id) == -1 && players.length < 2) {
    socket.emit("CanJoin", true);
    players.push(id);
  } else if (players.length == 2) {
    socket.emit("CanJoin", false);
  }
  if (players.length == 2) {
    StartPlaying(io);
  }
};

StartPlaying = (io) => {
  io.to(players[0]).emit("Role", "X");
  io.to(players[1]).emit("Role", "O");
  EmmitXO(io);
};

Playing = (io, socket) => {
  socket.on("Turn", (data) => {
    //console.log(data);
    let { x, y, role } = data;
    if (role == currPlayer) {
      xo[x][y] = currPlayer;
      winner = TestWin();
      if (winner == "X" || winner == "O") {
        EmmitXO(io);
        EmmitWinner(io, winner);
        currPlayer = "";
      } else {
        currPlayer = currPlayer == "X" ? "O" : "X";
        EmmitXO(io);
      }
    }
  });
};

PlayerLeaved = (io, socket) => {
  const id = socket.id;
  players = players.filter((id2) => {
    return id2 !== id;
  });
  if (players.length < 2) {
    reset(io);
  }
  io.emit("PlayerLeaved", players);
};

EmmitXO = (io) => {
  players.forEach((player) => {
    io.to(player).emit("xo", xo);
  });
};

EmmitWinner = (io, winner) => {
  players.forEach((player) => {
    io.to(player).emit("winner", winner);
  });
};

const reset = (io) => {
  xo = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currPlayer = "X";
  winner = "";
  EmmitXO(io);
  EmmitWinner(io, "");
};

const TestWin = () => {
  for (var i = 0; i < xo.length; i++) {
    if (xo[i][0] == xo[i][1] && xo[i][1] == xo[i][2]) {
      return xo[i][0];
    }
    if (xo[0][i] == xo[1][i] && xo[1][i] == xo[2][i]) {
      console.log(xo[0][i]);
      return xo[0][i];
    }
  }
  if (xo[0][0] == xo[1][1] && xo[1][1] == xo[2][2]) {
    return xo[1][1];
  }
  if (xo[0][2] == xo[1][1] && xo[1][1] == xo[2][0]) {
    return xo[1][1];
  }
  return "";
};

module.exports = {
  PlayerJoined,
  PlayerLeaved,
  Playing,
};
