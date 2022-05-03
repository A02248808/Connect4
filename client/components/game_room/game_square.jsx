export const GameSquare = ({ id, children }) => {
  return (
    <div id={id} className="gameSquare">
      {children}
    </div>
  );
};
