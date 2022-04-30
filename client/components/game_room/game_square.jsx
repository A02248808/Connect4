export const GameSquare = ({ id, color, children }) => {
  return (
    <div id={id} className={`gameSquare ${color}`}>
      {children}
    </div>
  );
};
