import { useState, useEffect } from 'react'

const Square = ({ value, handleClick }) => {
  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  )
}

const Board = ({ squares, handleClick }) => {
  return (
    <div className="board">
      <div>
        <div className="board-row">
          <Square value={squares[0]} handleClick={() => handleClick(0)} />
          <Square value={squares[1]} handleClick={() => handleClick(1)} />
          <Square value={squares[2]} handleClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} handleClick={() => handleClick(3)} />
          <Square value={squares[4]} handleClick={() => handleClick(4)} />
          <Square value={squares[5]} handleClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} handleClick={() => handleClick(6)} />
          <Square value={squares[7]} handleClick={() => handleClick(7)} />
          <Square value={squares[8]} handleClick={() => handleClick(8)} />
        </div>
      </div>
    </div>
  )
}

const History = ({ history, jumpTo }) => {
  return (
    <div className="history">
      <h4>History</h4>
      <ul>
        {history.map((steps, move) => {
          const description = move ? 'Go to move #' + move : 'Start (move #0)'
          return (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Define the initial game state
const initialGameState = {
  history: [{ squares: Array(9).fill(null) }],
  isPlayerOneNext: true,
  winner: null,
  stepNumber: 0
}

// Define the Game component
const Game = () => {
  // Define the gameState and setGameState using the initialGameState
  const [gameState, setGameState] = useState(initialGameState)

  // Define the handleSquareClick function
  const handleSquareClick = squareIndex => {
    // Destructure the gameState object
    const { history, isPlayerOneNext, stepNumber } = gameState
    // Create a new array with the current history
    const currentHistory = history.slice(0, stepNumber + 1)
    // Get the current squares from the current history
    const current = currentHistory[currentHistory.length - 1]
    // Create a new array with the current squares
    const squares = [...current.squares]

    // If there's already a winner or the square is already filled, do nothing
    if (calculateWinner(squares) || squares[squareIndex]) {
      return
    }

    // Update the squares array with the new move
    squares[squareIndex] = isPlayerOneNext ? 'O' : 'X'

    // Update the game state with the new history, isPlayerOneNext, and stepNumber
    setGameState(prevState => ({
      ...prevState,
      history: [...currentHistory, { squares }],
      isPlayerOneNext: !isPlayerOneNext,
      stepNumber: currentHistory.length
    }))
  }

  // Define the handleJumpTo function
  const handleJumpTo = step => {
    // Update the game state with the new isPlayerOneNext and stepNumber
    setGameState(prevState => ({
      ...prevState,
      isPlayerOneNext: step % 2 === 0,
      stepNumber: step
    }))
  }

  // Define the handleRestart function
  const handleRestart = () => {
    // Set the game state back to the initialGameState
    setGameState(initialGameState)
  }

  // Use the useEffect hook to update the game state when the history changes
  useEffect(() => {
    // Get the current squares
    const currentSquares =
      gameState.history[gameState.history.length - 1].squares
    // Calculate the new winner
    const newWinner = calculateWinner(currentSquares)
    // Update the game state with the new winner
    setGameState(prevState => ({ ...prevState, winner: newWinner }))
  }, [gameState.history])

  // Destructure the gameState object
  const { history, isPlayerOneNext, winner, stepNumber } = gameState

  return (
    <div className="main">
      <h2 className="result">Winner: {winner || ''}</h2>
      <div className="game">
        <span className="player">
          Next player is: {isPlayerOneNext ? 'O' : 'X'}
        </span>
        <Board
          squares={history[stepNumber].squares}
          handleClick={handleSquareClick}
        />
        <History history={history} jumpTo={handleJumpTo} />
      </div>
      <button onClick={handleRestart} className="restart-btn">
        Restart
      </button>
    </div>
  )
}

const calculateWinner = squares => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (const [a, b, c] of winningLines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

export default Game
