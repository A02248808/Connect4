export const Game = ({ children, to, action }) => {
  if (to) {
    return (
      <Link className="game" to={to}>
        {children}
      </Link>
    );
  }
  if (action) {
    return <button onClick={action}>{children}</button>;
  }
  return null;
};
