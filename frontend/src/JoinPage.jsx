// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

// export default function JoinPage() {
//   const [name, setName] = useState('');
//   const [vsAI, setVsAI] = useState(false);
//   const navigate = useNavigate();

//   const joinGame = () => {
//     const roomId = vsAI ? uuidv4() : prompt("Enter room ID or leave empty to create new");
//     navigate(`/game/${roomId}`, { state: { name, vsAI } });
//   };

//   return (
//     <div className="join-page">
//       <h1>Join Tic Tac Toe</h1>
//       <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
//       <label>
//         <input type="checkbox" checked={vsAI} onChange={() => setVsAI(!vsAI)} />
//         Play against AI
//       </label>
//       <button onClick={joinGame}>Start Game</button>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [vsAI, setVsAI] = useState(false);
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    const id = vsAI ? uuidv4() : roomId || uuidv4();
    navigate(`/game/${id}`, { state: { name, vsAI } });
  };

  return (
    <div className="join-page">
      <h1>Join Tic Tac Toe</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <label>
        <input
          type="checkbox"
          checked={vsAI}
          onChange={() => setVsAI(!vsAI)}
        />
        Play against AI
      </label>
      {!vsAI && (
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID (leave empty to create)"
        />
      )}
      <button onClick={handleJoin}>Start Game</button>
    </div>
  );
}
