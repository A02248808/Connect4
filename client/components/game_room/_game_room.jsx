import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { useNavigate } from 'react-router';
import { GameSquare } from './game_square';
import { AuthContext } from '../../utils/auth_context';
import { checkForWin } from './win_conditions';
import './game_room.css';
import { removeAllListeners } from 'process';
import { io } from 'socket.io-client';

export const GameRoom = () => {
  const rowCount = 6;
  const colCount = 7;

  const api = useContext(ApiContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const isP1Turn = useRef(true);
  const whatRowPerColumn = useRef(Array(colCount).fill(0));
  const [gameComplete, setGameComplete] = useState(false);
  const haveBoardInteraction = useRef(true);

  const [gameSquares, setGameSquares] = useState([]);
  const [info, setInfo] = useState("Red's turn");

  const [socket, setSocket] = useState(null);
  const [ authToken ] = useContext(AuthContext);

  useEffect(() => {
    const newSocket = io({
      auth: {
        token: authToken
      },
      query: {
        room: id
      }
    });
    setSocket(newSocket);
    newSocket.on('initial-moves', (data) => {
      data.forEach((move) => {
        clickSquare(move.moveOrder, move.moveColumn);
      });
    });
    newSocket.on('turn', (board) => {
      console.log(board)
      let currentRow = board.moveOrder;
      let column = board.moveColumn;
      clickSquare(currentRow, column);
    });
    newSocket.on('reset', () => {
      setGameComplete(false);
      haveBoardInteraction.current = true;
      isP1Turn.current = true;
      setInfo("Red's turn");
  
      // reset current row to drop pieces on
      whatRowPerColumn.current = Array(colCount).fill(0);
  
      // reset game pieces
      let gamePieces = Array.from(document.getElementsByClassName('animatedCircle'));
      gamePieces.forEach((gamePiece) => {
        gamePiece.style.backgroundColor = 'transparent';
        gamePiece.style.animation = 'reset';
      });
    })
    return () => {
      newSocket.off('turn');
      newSocket.off('reset');
      newSocket.disconnect();
    };
  }, []);

  const clickSquare = (currentRow, column) => {
    if (currentRow < rowCount) {
      let gamePiece = document.getElementById(`piece-${currentRow}-${column}`);

      let currentColor = isP1Turn.current ? 'red' : 'yellow';
      gamePiece.style.backgroundColor = currentColor;
      gamePiece.style.animation = 'fall 0.5s';

      if (checkForWin(currentColor, rowCount, colCount)) {
        setGameComplete(true);
        haveBoardInteraction.current = false;
        setInfo(`${currentColor.charAt(0).toUpperCase() + currentColor.slice(1)} wins!!`);

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
  }

  // runs only on first render
  useEffect(async () => {
    // create list of GameSquares with animated circle divs inside them
    let key = 1;
    let tempArr = [];
    for (let i = 0; i < rowCount; i++) {
      tempArr.push([]);
      for (let j = 0; j < colCount; j++) {
        let squareId = `square-${rowCount - 1 - i}-${j}`; // squareId -> square-rowNumber-colNumber (square-0-0 is bottom left square)
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
    addListeners(); // adds onclick and hover listeners
  }, [gameSquares]);

  const squareOnClick = (e) => {
    if (!haveBoardInteraction.current) return;
    let square = e.currentTarget;
    let column = square.id.split('-')[2];
    let currentRow = whatRowPerColumn.current[column];
    socket.emit('turn', { moveOrder: currentRow, moveColumn: column });
  };

  // blue background on column your mouse is on
  const columnHoverOn = (e) => {
    if (!haveBoardInteraction.current) return;
    let colNum = e.currentTarget.id.split('-')[2];
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      if (square.id.split('-')[2] == colNum) {
        square.classList.add('gameColumnHover');
      }
    });
  };
  const columnHoverOff = (e) => {
    if (!haveBoardInteraction.current) return;
    let colNum = e.currentTarget.id.split('-')[2];
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      if (square.id.split('-')[2] == colNum) {
        square.classList.remove('gameColumnHover');
      }
    });
  };

  const addListeners = () => {
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    console.log('Adding Listeners: ' + squares.length);
    squares.forEach((square) => {
      square.addEventListener('click', squareOnClick);
      square.addEventListener('mouseenter', columnHoverOn);
      square.addEventListener('mouseleave', columnHoverOff);
    });
  };

  // const removeListeners = () => {
  //   let squares = Array.from(document.getElementsByClassName('gameSquare'));
  //   console.log('Removing Listeners: ' + squares.length);
  //   squares.forEach((square) => {
  //     console.log(square.id);
  //     square.removeEventListener('click', squareOnClick);
  //     square.removeEventListener('mouseenter', columnHoverOn);
  //     square.removeEventListener('mouseleave', columnHoverOff);
  //   });
  // };

  const resetGame = () => {
    socket.emit('reset', { gameRoomId: id });
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
