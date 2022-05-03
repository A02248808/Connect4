import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { useNavigate } from 'react-router';
import { GameSquare } from './game_square';
import { debug } from 'console';
import { checkForWin } from './win_conditions';
import './game_room.css';
import { useTurns } from '../../utils/use_turns';
import { removeAllListeners } from 'process';

export const GameRoom = () => {
  const rowCount = 6;
  const colCount = 7;

  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  console.log(id);
  const [board, doTurn] = useTurns(id);
  const navigate = useNavigate();

  const isP1Turn = useRef(true);
  const whatRowPerColumn = useRef(Array(colCount).fill(0));
  const [gameComplete, setGameComplete] = useState(false);

  const [gameRoom, setGameRoom] = useState(null);
  const [gameSquares, setGameSquares] = useState([]);
  const [info, setInfo] = useState("Red's turn");

  // runs only on first render
  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);

    let key = 1;
    let tempArr = [];
    for (let i = 0; i < rowCount; i++) {
      tempArr.push([]);
      for (let j = 0; j < colCount; j++) {
        let squareId = `square-${rowCount - 1 - i}-${j}`;
        let pieceId = `piece-${rowCount - 1 - i}-${j}`;
        tempArr[i].push(
          <GameSquare id={squareId} key={key}>
            <div id={pieceId} className="animatedCircle" />
          </GameSquare>,
        );
        key += 1;
      }
    }

    setGameSquares(tempArr);
  }, []);

  useEffect(async () => {
    addListeners();
  }, [gameSquares]);

  const squareOnClick = (e) => {
    let square = e.currentTarget;
    let column = square.id.split('-')[2];
    let currentRow = whatRowPerColumn.current[column];
    if (currentRow < rowCount) {
      let gamePiece = document.getElementById(`piece-${currentRow}-${column}`);

      let currentColor = isP1Turn.current ? 'red' : 'yellow';
      gamePiece.style.backgroundColor = currentColor;
      gamePiece.style.animation = 'fall 0.5s';

      if (checkForWin(currentColor, rowCount, colCount)) {
        setInfo(`${currentColor.charAt(0).toUpperCase() + currentColor.slice(1)} wins!!`);
        setGameComplete(true);
        document.getElementsByClassName('newGameButton')[0].disabled = false;
        removeListeners();

        // remove column hover class
        Array.from(document.getElementsByClassName('gameColumnHover')).forEach((item) => {
          item.classList.remove('gameColumnHover');
        });
      } else {
        isP1Turn.current = !isP1Turn.current;
        whatRowPerColumn.current[column]++;

        setInfo(`${isP1Turn.current ? "Red's" : "Yellow's"} turn`);
      }
    }
  };

  const toggleColumnHover = (e) => {
    let colNum = e.currentTarget.id.split('-')[2];
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      if (square.id.split('-')[2] == colNum) {
        square.classList.toggle('gameColumnHover');
      }
    });
  };

  const addListeners = () => {
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      square.addEventListener('click', squareOnClick);
      square.addEventListener('mouseenter', toggleColumnHover);
      square.addEventListener('mouseleave', toggleColumnHover);
    });
  };

  const removeListeners = () => {
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      square.removeEventListener('click', squareOnClick);
      square.removeEventListener('mouseenter', toggleColumnHover);
      square.removeEventListener('mouseleave', toggleColumnHover);
    });
  };

  const resetGame = () => {
    setGameComplete(false);
    document.getElementsByClassName('newGameButton')[0].disabled = true;

    isP1Turn.current = true;
    setInfo("Red's turn");

    // add listeners again
    addListeners();

    // reset current row to drop pieces on
    whatRowPerColumn.current = Array(colCount).fill(0);

    // reset game pieces
    let gamePieces = Array.from(document.getElementsByClassName('animatedCircle'));
    gamePieces.forEach((gamePiece) => {
      gamePiece.style.backgroundColor = 'transparent';
      gamePiece.style.animation = 'reset';
    });
  };

  return (
    <div className="bg-gray-400 w-full h-full">
      <button className="backButton" onClick={() => navigate('/')}>
        Back
      </button>
      <button className={`newGameButton ${gameComplete ? '' : 'opacity-50 cursor-default'}`} onClick={resetGame}>
        New Game
      </button>
      <div className="gameArea">{gameSquares}</div>
      <p className={`info ${isP1Turn.current ? 'text-red-600' : 'text-yellow-500'}`}>{info}</p>
    </div>
  );
};
