import { Link } from 'react-router-dom';

export const Game = ({ children, to, action }) => {
  if (to) {
    return (
    <div className="game">
      <Link className="p-4" to={to}>
        {children}
      </Link>
    </div>
    );
  }
  if (action) {
    return (
    <div className="new-game">  
      <button onClick={action}>
        {children}
      </button>
    </div>
    );
  }
  return null;
};
