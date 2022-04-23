import { useState, useRef, useEffectm, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './auth_context';

export const useTurns = ({ room }) => {

  const [board, setBoard] = useState([]);
  const [socket, setSocket] = useState(null);
  const authToken = useContext(AuthContext);

  useEffect(() => {
    const newSocket = io({
      auth: {
        token: authToken
      },
      query: {
        room
      }
    });
    setSocket(newSocket);
    newSocket.on('turn', (board) => {
      setTurns(board);
    });
    return () => {
      newSocket.off('turn');
      newSocket.disconnect();
    };
  }, []);

  const doTurn = (row, column, player) => {
    socket.emit('turn', { row, column, player });
  }


  return [board, doTurn];
}