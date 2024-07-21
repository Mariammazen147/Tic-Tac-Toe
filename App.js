import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const nextSquares = squares.slice();
    const winnerInfo = calculateWinner(squares);

    if (squares[i] || winnerInfo || isBoardFull(squares)) {
      return;
    }

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];
  const status = winner
    ? "Winner: " + winner
    : isBoardFull(squares)
    ? "The game is a draw"
    : "Next player: " + (xIsNext ? "X" : "O");

  const boardSize = 3; // Assuming a 3x3 board
  const rows = [];

  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={winningLine.includes(index)}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "You're at move #" + move;
    } else {
      description = "You're at game start";
    }

    return <li key={move}>{description}</li>;
  });

  if (!isAscending) {
    moves.reverse();
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
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
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((square) => square !== null);
}
