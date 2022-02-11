import toast from 'react-hot-toast';

import { getTimeDisplay } from "../components/TimeTaken";
import { BOARD_SIZE, META_CONTENT } from "../constants";

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

export const getShareString = (board, timeTaken) => {
  const boundingBox = getSmallestBoundingBox(board);
  const shareString = `${META_CONTENT.title}\n\n`;

  if (timeTaken) {
    shareString += `Solved in: ${getTimeDisplay(timeTaken)}\n\n`;
  }

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

export const handleShare = (board, timeTaken) => {
  if (navigator.share) {
    navigator.share({
      text: getShareString(board, timeTaken)
    })
  } else {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareString(board, timeTaken))
      .then(() => {
        toast.success('Copied to clipboard');
      });
    }
  }
}

const getNumberSuffix = (number) => {
  const mod = number % 10;
  if (mod === 0) {
    return '';
  } else if (mod === 1) {
    return 'st';
  } else if (mod === 2) {
    return 'nd'
  } else if (mod === 3) {
    return 'rd';
  } else {
    return 'th';
  }
}