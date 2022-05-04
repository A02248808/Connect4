import { Link } from 'react-router-dom';

export const Game = ({ children, to, action }) => {
  if (to) {
    return (
      <Link className="game" to={to}>
        {children}
      </Link>
    );
  }
  if (action) {
    return (
      <button className="game" onClick={action}>
        {children}
      </button>
    );
  }
  return null;
};
