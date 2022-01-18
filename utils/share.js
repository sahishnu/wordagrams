import { BOARD_SIZE } from "../constants";

const getSmallestBoundingBox = (board) => {
  let smallestBox = {
    top: BOARD_SIZE,
    left: BOARD_SIZE,
    bottom: 0,
    right: 0
  };

  Object.keys(board).forEach(key => {
    const { letter } = board[key];
    const col = key % BOARD_SIZE;
    const row = Math.floor(key / BOARD_SIZE);

    if (letter != '') {
      smallestBox.top = Math.min(smallestBox.top, row);
      smallestBox.left = Math.min(smallestBox.left, col);
      smallestBox.bottom = Math.max(smallestBox.bottom, row);
      smallestBox.right = Math.max(smallestBox.right, col);
    }
  });

  return smallestBox;
}

export const getShareString = (board) => {
  const boundingBox = getSmallestBoundingBox(board);
  const shareString = 'Word Cross\n\n';

  for (let row = boundingBox.top; row <= boundingBox.bottom; row++) {
    const leftLim = row * BOARD_SIZE + boundingBox.left;
    const rightLim = leftLim + (boundingBox.right - boundingBox.left);
    for (let col = leftLim; col <= rightLim; col++) {
      const letter = board[col].letter;
      shareString += letter === '' ? '⬛' : '🟩';
    }
    if (row < boundingBox.bottom) {
      shareString += '\n';
    }
  }

  return shareString;

}