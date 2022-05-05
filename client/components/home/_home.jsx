import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { Button } from '../common/button';
import { Game } from './game';
import { GameRoomModal } from './new_game_modal';

export const Home = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [gameRooms, setGameRooms] = useState([]);

  useEffect(async () => {
    const { gameRooms } = await api.get('/game_rooms');
    setGameRooms(gameRooms);
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);
  }, []);

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const createGame = async (name) => {
    setIsOpen(false);
    const { gameRoom } = await api.post('/game_rooms', { name });
    setGameRooms([...gameRooms, gameRoom]);
  };

  return (
    <div className="wrapper">
      <h1 className="text-5xl m-3 font-bold">Welcome to Connect4 {user.firstName}!</h1>
      <div className="top-bar">
        <Button className="game" type="button" onClick={logout}>
          Logout
        </Button>
        {roles.includes('admin') && (
          <Button type="button" className="game" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        )}
      </div>
      <div className="game-select">
        <Game action={() => setIsOpen(true)}>+</Game>
        {gameRooms.map((game) => {
          return (
            <Game key={game.id} to={`game_rooms/${game.id}`}>
              {game.name}
            </Game>
          );
        })}
        {isOpen ? <GameRoomModal createGame={createGame} closeModal={() => setIsOpen(false)} /> : null}
      </div>
    </div>
  );
};
