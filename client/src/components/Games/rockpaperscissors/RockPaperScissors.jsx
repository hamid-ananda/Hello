import React, { useState, useRef, useEffect } from "react";
import './RockPaperScissors.css';
import io from 'socket.io-client';
import rockpic from './assets/rock.svg';
import paperpic from './assets/paper.svg';
import scissorspic from './assets/scissor.svg';

function RockPaperScissors() {
  const socket = useRef(io('http://localhost:8080', { transports: ['websocket'] }));
  const [roomUniqueId, setRoomUniqueId] = useState('');
  const player1 = useRef(false);

  useEffect(() => {
    // Initialize room ID on component mount
    socket.current.emit('getRoomUniqueId');
    socket.current.on('receiveRoomUniqueId', (data) => {
      setRoomUniqueId(data.roomUniqueId);
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.current.off('receiveRoomUniqueId');
    };
  }, []);

  function createGame() {
    console.log("creategame");
    player1.current = true;
    console.log("player number:", player1.current);
    socket.current.emit('createGame');
  }

  function joinGame() {
    console.log("joingame")
    socket.current.emit('joinGame', { roomUniqueId });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(roomUniqueId);
    alert("Room ID copied to clipboard!");
  }

  socket.current.on('connect_error', (err) => {
    console.log(err);
  });

  socket.current.on('connect', () => {
    console.log('Connected!');
  });

  socket.current.on("newGame", (data) => {
    setRoomUniqueId(data.roomUniqueId);
    document.getElementById('initial').style.display = 'empty';
    document.getElementById('gamePlay').style.display = 'block';
    document.getElementById('waitingArea').innerHTML = `Waiting for opponent, please share the 6 letter code above with your friend  to initiate the game`;
  });

  socket.current.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';
  });

  socket.current.on("p1Choice", (data) => {
    if (!player1.current) {
      createOpponentChoiceButton(data);
    }
  });

  socket.current.on("p2Choice", (data) => {
    if (player1.current) {
      createOpponentChoiceButton(data);
    }
  });

  socket.current.on("result", (data) => {

    console.log(player1.current);
    console.log(data.winner);

    let winnerText = '';
    if (data.winner !== 'd') {
      if (data.winner === 'p1' && !player1.current) {
        winnerText = 'You win';
      } else if (data.winner === 'p1') {
        winnerText = 'You lose';
      } else if (data.winner === 'p2' && player1.current) {
        winnerText = 'You win';
      } else if (data.winner === 'p2') {
        winnerText = 'You lose';
      }
    } else {
      winnerText = `It's a draw`;
    }
    document.getElementById('opponentState').style.display = 'block';
    document.getElementById('opponentButton').style.display = 'block';
    document.getElementById('winnerArea').innerHTML = winnerText;
  });

  function sendChoice(rpsValue) {
    const choiceEvent = player1.current ? "p1Choice" : "p2Choice";
    socket.current.emit(choiceEvent, {
      rpsValue: rpsValue,
      roomUniqueId: roomUniqueId
    });
    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.innerText = rpsValue;
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);
  }

  function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Opponent made a choice";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.classList.add(data.rpsValue.toString().toLowerCase());
    opponentButton.style.display = 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
  }

  return (
    <div>
      <div>
        <div>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Rock Paper Scissors Game</title>
          <link rel="stylesheet" href="./style.css" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous" />
          <div id="initial" className="container row-md-6">
            <img height="200" src={rockpic} className="img-responsive px-5 my-3 mx-4" alt="Rock" />
            <img height="200" src={paperpic} className="img-responsive px-5 my-3 mx-4" alt="Paper" />
            <img height="200" src={scissorspic} className="img-responsive px-5 my-3 mx-4" alt="Scissor" />
          </div>
        </div>
      </div>

      <div>
        <h1 className="container text-center">Welcome to Rock, Paper and Scissors game</h1>
        <div className="container col-md-6">
          <button className="form-control btn btn-primary" onClick={createGame}> Create Game</button>
          <div className="text-center display-3">or</div>
          <div className="d-flex">
            <input className="form-control my-2" placeholder="Enter Code" type="text" value={roomUniqueId} onChange={e => setRoomUniqueId(e.target.value)} />
            <button className="form-control btn btn-secondary" onClick={joinGame}> Join Game </button>
            <button className="form-control btn btn-secondary" onClick={copyToClipboard}> Copy ID </button>
          </div>
        </div>
        <div id="gamePlay" className="container">
          <div id="waitingArea" className="h4"></div>
          <div id="gameArea" className="h3 row" style={{ display: 'none' }}>
            <div className="col-md-6">
              You:
              <div id="player1Choice">
                <button className="rock" onClick={() => sendChoice('Rock')}> Rock </button>
                <button className="paper" onClick={() => sendChoice('Paper')}>  Paper </button>
                <button className="scissor" onClick={() => sendChoice('Scissor')}> Scissors </button>
              </div>
            </div>
            <div className="col-md-6">
              Opponent:
              <div id="player2Choice">
                <p id="opponentState">Waiting for Opponent</p>
              </div>
            </div>
          </div>
          <hr />
          <div id="winnerArea" className="display-4"></div>
        </div>
      </div>
    </div>
  );
}

export default RockPaperScissors;
