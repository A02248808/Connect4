let rowCount = 0;
let colCount = 0;

export const checkForWin = (color, rowNum, colNum) => {
  rowCount = rowNum;
  colCount = colNum;
  // a temporary array of 1's and 0's with 1's being the current players pieces
  let gameArray = [];
  for (let r = 0; r < rowCount; r++) {
    gameArray.push(new Array(colCount).fill(0));
  }

  // set game array
  let gamePieces = Array.from(document.getElementsByClassName('animatedCircle'));
  gamePieces.forEach((gamePiece) => {
    if (gamePiece.style.backgroundColor == color) {
      let row = gamePiece.id.split('-')[1];
      let col = gamePiece.id.split('-')[2];
      gameArray[row][col] = 1;
    }
  });

  if (checkHorizontal(gameArray) || checkVertical(gameArray) || checkDiagonal(gameArray)) {
    return true;
  } else return false;
};

const checkHorizontal = (gameArray) => {
  for (let r = 0; r < rowCount; r++) {
    inARow = 0;
    for (let c = 0; c < colCount; c++) {
      if (gameArray[r][c] == 1) inARow++;
      else inARow = 0;

      if (inARow == 4) return true;
    }
  }
  return false;
};

const checkVertical = (gameArray) => {
  for (let c = 0; c < colCount; c++) {
    inARow = 0;
    for (let r = 0; r < rowCount; r++) {
      if (gameArray[r][c] == 1) inARow++;
      else inARow = 0;

      if (inARow == 4) return true;
    }
  }
  return false;
};

const checkDiagonal = (gameArray) => {
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      if (gameArray[r][c] == 1) {
        // check diagonal -> \ and check diagonal -> /
        if (checkDiagonalHelper(gameArray, r, c, 1, -1) || checkDiagonalHelper(gameArray, r, c, 1, 1)) {
          return true;
        }
      }
    }
  }
  return false;
};

const checkDiagonalHelper = (gameArray, row, col, inARow, columnDirection) => {
  if (inARow == 4) return true;
  let nextRow = row + 1;
  let nextCol = col + columnDirection;
  if (nextRow < rowCount && nextCol >= 0 && nextCol < colCount && gameArray[nextRow][nextCol] == 1) {
    return checkDiagonalHelper(gameArray, nextRow, nextCol, inARow + 1, columnDirection);
  }

  return false;
};
