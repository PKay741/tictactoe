export default function Board({ board, onClick }) {
    return (
      <div className="board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
        {board.map((val, idx) => (
          <button key={idx} onClick={() => onClick(idx)} style={{ width: 100, height: 100 }}>
            {val}
          </button>
        ))}
      </div>
    );
  }