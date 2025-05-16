// import Confetti from 'react-confetti';
// import { useWindowSize } from '@react-hook/window-size';

// export default function GameOverModal({ winner, mySymbol, onRestart }) {
//   const [width, height] = useWindowSize();

//   const isWin = winner === mySymbol;
//   const isLoss = winner && winner !== mySymbol && winner !== "draw";
 
//   return (
//     <div className="modal-overlay">
//       {isWin && <Confetti width={width} height={height} />}
//       <div className="modal">
//         <h2>
//           {winner === "draw"
//             ? "It's a Draw!"
//             : isWin
//             ? "You Win! 🎉"
//             : "You Lose 😢"}
//         </h2>
        

//         <button onClick={onRestart}>Play Again</button>
//       </div>
//     </div>
//   );
// }


import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

export default function GameOverModal({ winner, mySymbol, onRestart }) {
  const [width, height] = useWindowSize();

  const normalizedWinner = winner?.toLowerCase();
  const normalizedMySymbol = mySymbol?.toLowerCase();

  const isWin = normalizedWinner === normalizedMySymbol;
  const isLoss =
    normalizedWinner &&
    normalizedWinner !== normalizedMySymbol &&
    normalizedWinner !== "draw";

  return (
    <div className="modal-overlay">
      {isWin && <Confetti width={width} height={height} />}
      <div className="modal">
        <h2>
          {normalizedWinner === "draw"
            ? "It's a Draw!"
            : isWin
            ? "You Win! 🎉"
            : "You Lose 😢"}
        </h2>
        <button onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}
