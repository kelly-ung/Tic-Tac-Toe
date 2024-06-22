import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className={value === 'X' ? 'square X' : 'square O'} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let statusColor;
  if (winner === 'X') {
    statusColor = "status X"
    status = winner + ' is the Winner!';
  } else if (winner === 'O') {
    statusColor = "status O"
    status = winner + ' is the Winner!';
  } else if (squares.every(square => square !== null)) { 
    statusColor = "status"
    status = 'Draw!';
  } else {
    statusColor = "status"
    status = (xIsNext ? 'X' : 'O') + "'s Turn";
  }

  const boardRows = [];
  for (let i = 0; i < 3; ++i) {
    const row = [];
    for (let k = 0; k < 3; k++) {
      const squareIndex = i * 3 + k;
      row.push(
      <Square 
        key={squareIndex}
        value={squares[squareIndex]} 
        onSquareClick={() => handleClick(squareIndex)}
      />
      );
    }
    boardRows.push(<div key={i} className="board-row">{row}</div>);
  }

  return (
    <>
        <div className={statusColor}>{status}</div>
        {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove && move === 0) {
      description = 'Click to start game';
    } else if (move === currentMove) {
      description = 'You are at move ' + move;
    } else if (move > 0) {
      description = 'Go to move ' + move;
    } else {
      description = 'Go to game start';
    }
    
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button className="moves-button" onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <>
    <div>
        <ol className="game-info">
          <div className="game-header">Game History</div>
          {moves}
        </ol>
    </div>
    <div className="header">Tic Tac Toe</div>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
    </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}