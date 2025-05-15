// import { useEffect, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { connectToGame, sendMove } from './websocket';
// import Board from './Board';

// export default function GamePage() {
//   const { roomId } = useParams();
//   const { state } = useLocation();
//   const [symbol, setSymbol] = useState('X');
//   const [board, setBoard] = useState(Array(9).fill(""));
//   const [winner, setWinner] = useState(null);

//   useEffect(() => {
//     connectToGame(roomId, state.name, (msg) => {
//       if (msg.type === "move") {
//         setBoard((b) => {
//           const newBoard = [...b];
//           newBoard[msg.index] = msg.symbol;
//           return newBoard;
//         });
//       } else if (msg.type === "game_over") {
//         setWinner(msg.winner);
//       }
//     });
//   }, []);

//   const handleClick = (idx) => {
//     if (!board[idx] && !winner) {
//       sendMove({ index: idx, symbol, vsAI: state.vsAI });
//     }
//   };

//   return (
//     <div>
//       <h2>Room: {roomId}</h2>
//       <Board board={board} onClick={handleClick} />
//       {winner && <div>{winner === "draw" ? "It's a draw!" : `${winner} wins!`}</div>}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { connectWebSocket, sendMessage, closeWebSocket } from "./websocket";
import GameOverModal from './GameOverModal';


export default function GamePage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [mySymbol, setMySymbol] = useState("X");
  const [winner, setWinner] = useState(null);

  const isMyTurn = turn === mySymbol;

  useEffect(() => {
    if (!state?.name) {
      navigate("/");
      return;
    }

    connectWebSocket(roomId, handleMessage);

    // if (!state.vsAI) {
    //   setMySymbol("X"); // Could be dynamic in a real app
    // }

    return () => closeWebSocket();
  }, []);

  // function handleMessage(data) {
  //   if (data.type === "ai_move") {
  //     handleMove(data.index, "O");
  //   } else if (data.type === "move") {
  //     handleMove(data.index, data.symbol);
  //   }
  // }
  
  function handleMessage(data) {
  if (data.type === "assign_symbol") {
    setMySymbol(data.symbol);
  } else if (data.type === "ai_move") {
    handleMove(data.index, "O");
  } else if (data.type === "move") {
    handleMove(data.index, data.symbol);
  }
}


  function handleMove(index, symbol) {
    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[index] = symbol;
      return newBoard;
    });
    setTurn(symbol === "X" ? "O" : "X");

    const winner = checkWinner(board);
    if (winner) setWinner(winner);
  }

//   function makeMove(index) {
//     if (board[index] || winner || !isMyTurn) return;

//     const newBoard = [...board];
//     newBoard[index] = mySymbol;
//     setBoard(newBoard);
//     setTurn(mySymbol === "X" ? "O" : "X");

//     const message = {
//       type: "move",
//       index,
//       symbol: mySymbol,
//       vsAI: state.vsAI,
//       board: newBoard,
//     };

//     sendMessage(message);

//     const winner = checkWinner(newBoard);
//     if (winner) setWinner(winner);
//   }
  function makeMove(index) {
  if (board[index] || winner || !isMyTurn) return;

  const newBoard = [...board];
  newBoard[index] = mySymbol;
  setBoard(newBoard);
  console.log("Board after move:", newBoard);
  setTurn(mySymbol === "X" ? "O" : "X");

  const newWinner = checkWinner(newBoard);
  if (newWinner) setWinner(newWinner);

  sendMessage({
    type: "move",
    index,
    symbol: mySymbol,
    vsAI: state.vsAI,
    board: newBoard,
  });
}

  function checkWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell)) return "Draw";
    return null;
  }

  

  return (
    <div className="game-page" style={{ textAlign: "center", padding: "2rem", color: "white" }}>
      <h2>Room: {roomId}</h2>
      <h3>Player: {state.name} ({mySymbol})</h3>
      <h3>{winner ? `Winner: ${winner}` : `Turn: ${turn}`}</h3>
      <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: "10px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
        {board.map((cell, i) => (
          <button
          key={i}
          onClick={() => makeMove(i)}
          disabled={!!cell || !!winner}
          style={{
            width: "100px",
            height: "100px",
            fontSize: "48px",
            fontWeight: "bold",
            color: "purple",
            backgroundColor: "orange",
            border: "2px solid #333",
            cursor: cell || winner ? "not-allowed" : "pointer",
          }}
        >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <GameOverModal
          winner={winner}
          mySymbol={mySymbol}
          onRestart={() => {
      // reset state
            setBoard(Array(9).fill(""));
            setWinner(null);
            setTurn("X");
            if (state.vsAI) {
              setMySymbol("X");  // Or randomize who starts
            }
          }}
        />
      )}
    </div>
  );
}
