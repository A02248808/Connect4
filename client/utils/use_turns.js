import { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './auth_context';

export const useTurns = ({ room }) => {

  const [board, setBoard] = useState([]);
  const [socket, setSocket] = useState(null);
  const [ authToken ] = useContext(AuthContext);

  useEffect(() => {
    console.log(room)
    const newSocket = io({
      auth: {
        token: authToken
      },
      query: {
        room:'1'
      }
    });
    setSocket(newSocket);
    newSocket.on('turn', (board) => {
      setBoard(board);
    });
    newSocket.on('reset', () => {
      setBoard([]);
    })
    return () => {
      newSocket.off('turn');
      newSocket.off('reset');
      newSocket.disconnect();
    };
  }, []);

  const doTurn = (row, column) => {
    socket.emit('turn', { gameRoomId: room, moveOrder: row, moveColumn: column });
  }

  const resetBoard = () => {
    socket.emit('reset', { gameRoomId: room });
  }

  return [board, doTurn, resetBoard];
}