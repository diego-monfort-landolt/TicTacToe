import React, { useState } from 'react'
import confeti from 'canvas-confetti'
import './App.css'

const TURNS = {
  X: '❌',
  O: '⭕'
}

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
]

function App() {
  const [board, setBoard] = useState(() => {const boardFromStorage = window.localStorage.getItem('board')
  return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)})
  const [turn, setTurn] = useState(() => {const boardFromStorage = window.localStorage.getItem('board')
  return boardFromStorage ? JSON.parse(boardFromStorage) : TURNS.X})
  const [winner, setWinner] = useState(null)

  const checkWinner = (boarToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boarToCheck[a] &&
        boarToCheck[a] === boarToCheck[b] &&
        boarToCheck[a] === boarToCheck[c]
      ) {
        return boarToCheck[a]
      }
    }
    //si hay ganador
    return null
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }
  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return  //no actualizamos si ya hay algo o hay un ganador
    //actualizar la tabla
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    //Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar el turno
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    //revisar si hay winner
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confeti()
      setWinner(newWinner)
      // TODO:  check if game is over
    } else if (checkEndGame(newBoard)) {
      setWinner(false) //empate
    }
  }
  return (
    <>
      <main className='board'>
        <h1>Tic Tac Toe</h1>
        <button onClick={resetGame}>New Game</button>
        <section className='game'>
          {
            board.map((_, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {board[index]}
                </Square>
              )
            })
          }
        </section>
        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>
        {
          winner !== null && (
            <section className='winner'>
              <div className='text'>
                <h2>
                  {
                    winner === false
                      ? 'Empate'
                      : 'Winner: ' + winner
                  }
                </h2>
                <header className='win'>
                  {winner && <Square>{winner}</Square>}
                </header>
                <footer>
                  <button onClick={resetGame}>New Game</button>
                </footer>
              </div>
            </section>
          )
        }
      </main>
    </>
  )
}
export default App