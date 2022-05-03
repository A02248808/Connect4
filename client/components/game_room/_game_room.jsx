import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { useNavigate } from 'react-router';
import { GameSquare } from './game_square';
import { debug } from 'console';
import './game_room.css';
import { useTurns } from '../../utils/use_turns';

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

  const [gameRoom, setGameRoom] = useState(null);
  const [gameSquares, setGameSquares] = useState([]);

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
        tempArr[i].push(
          <GameSquare id={squareId} key={key}>
            <div className="animatedCircle" />
          </GameSquare>,
        );
        key += 1;
      }
    }

    setGameSquares(tempArr);
  }, []);

  useEffect(async () => {
    let squares = Array.from(document.getElementsByClassName('gameSquare'));
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        let column = square.id.split('-')[2];
        let currentRow = whatRowPerColumn.current[column];
        if (currentRow < rowCount) {
          let pieceDrop = document.getElementById(`square-${currentRow}-${column}`).firstChild;

          pieceDrop.style.backgroundColor = isP1Turn.current ? 'red' : 'yellow';
          pieceDrop.style.animation = 'fall 0.5s';

          isP1Turn.current = !isP1Turn.current;
          whatRowPerColumn.current[column]++;
        }
      });
    });
  }, [gameSquares]);

  return (
    <>
      <button className="backButton" onClick={() => navigate('/')}>
        Back
      </button>
      <div className="gameArea">{gameSquares}</div>;
    </>
  );
};
