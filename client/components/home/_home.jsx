import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { Button } from '../common/button';
import { Game } from './game';

export const Home = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  return (
    <div className="wrapper">
      <div className="p-4">
        <h1>Welcome {user.firstName}</h1>
        <Button type="button" onClick={logout}>
          Logout
        </Button>
        {roles.includes('admin') && (
          <Button type="button" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        )}
        <Button type="button" onClick={() => navigate('/game_room/1')}>
          Play Game
        </Button>
      </div>
      <div className="game-select">
        {gameRooms.map((game) => {
          return (
            <Game key={game.id} to={`game_rooms/${game.id}`}>
              {game.name}
            </Game>
          );
        })}
      </div>
    </div>
  );
};
