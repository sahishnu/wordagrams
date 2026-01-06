#!/usr/bin/env node

/**
 * Grid Word Solution Generator
 *
 * Generates crossword-style solutions for arranging letters on a square grid.
 * All letters must be used, words must be at least 3 letters, and all words
 * must be valid English dictionary words.
 *
 * Usage:
 *   node generate-solutions.js --letters <letters> [options]
 *
 * Examples:
 *   node generate-solutions.js --letters "catdog"
 *   node generate-solutions.js -l "catdog" -g 4 -m 5
 *   node generate-solutions.js -l "catdog" -w 4 -e "coat,coda"
 *
 * Run with --help for all options.
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURATION
// ============================================================================

const MIN_WORD_LENGTH = 3;
const DEFAULT_GRID_SIZE = 9;
const DEFAULT_MAX_SOLUTIONS = 5;
const DEFAULT_TIMEOUT_SECONDS = 60; // 1 minute timeout
const DEFAULT_MAX_WORD_LENGTH = 0; // 0 means no limit

// Global timeout tracking
let searchStartTime = null;
let timeoutSeconds = DEFAULT_TIMEOUT_SECONDS;
let isTimedOut = false;

/**
 * Check if the search has timed out
 */
function checkTimeout() {
  if (searchStartTime && Date.now() - searchStartTime > timeoutSeconds * 1000) {
    isTimedOut = true;
    return true;
  }
  return false;
}

// ============================================================================
// DICTIONARY LOADING
// ============================================================================

/**
 * Load the dictionary from dictionary.json
 */
function loadDictionary() {
  const dictionaryPath = path.join(__dirname, "dictionary.json");
  const rawData = fs.readFileSync(dictionaryPath, "utf-8");
  return JSON.parse(rawData);
}

/**
 * Check if a word exists in the dictionary
 */
function isValidWord(word, dictionary) {
  return dictionary[word.toLowerCase()] === true;
}

// ============================================================================
// WORD FINDER - Find all valid words from input letters
// ============================================================================

/**
 * Find all valid words that can be formed from the given letters
 * @param {string} letters - Available letters
 * @param {object} dictionary - Dictionary of valid words
 * @param {number} maxWordLength - Maximum word length (0 = no limit)
 */
function findAllValidWords(letters, dictionary, maxWordLength = 0) {
  const validWords = new Set();
  const letterArray = letters.toLowerCase().split("");
  const maxLen = maxWordLength > 0 ? maxWordLength : letterArray.length;

  // For efficiency, we'll check words in the dictionary that could be formed
  // from our letters instead of generating all permutations
  const letterCounts = {};
  for (const letter of letterArray) {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  // Check each dictionary word to see if it can be formed from our letters
  for (const word of Object.keys(dictionary)) {
    if (word.length < MIN_WORD_LENGTH || word.length > maxLen) {
      continue;
    }

    // Check if word can be formed from available letters
    const wordCounts = {};
    for (const letter of word) {
      wordCounts[letter] = (wordCounts[letter] || 0) + 1;
    }

    let canForm = true;
    for (const [letter, count] of Object.entries(wordCounts)) {
      if (!letterCounts[letter] || letterCounts[letter] < count) {
        canForm = false;
        break;
      }
    }

    if (canForm) {
      validWords.add(word);
    }
  }

  return Array.from(validWords);
}

// ============================================================================
// GRID OPERATIONS
// ============================================================================

/**
 * Create an empty grid of the given size
 */
function createEmptyGrid(size) {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}

/**
 * Clone a grid (deep copy)
 */
function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

/**
 * Check if a position is within grid bounds
 */
function isInBounds(row, col, size) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

/**
 * Try to place a word on the grid at the given position and direction
 * Returns the new grid if successful, null if placement is invalid
 */
function tryPlaceWord(grid, word, row, col, isHorizontal) {
  const size = grid.length;
  const newGrid = cloneGrid(grid);

  for (let i = 0; i < word.length; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;

    if (!isInBounds(r, c, size)) {
      return null;
    }

    const currentCell = newGrid[r][c];
    const letter = word[i];

    if (currentCell !== null && currentCell !== letter) {
      return null; // Conflict
    }

    newGrid[r][c] = letter;
  }

  return newGrid;
}

/**
 * Get all letter sequences (words) on the grid in a given direction
 */
function getSequencesInDirection(grid, isHorizontal) {
  const size = grid.length;
  const sequences = [];

  const outerLimit = size;
  const innerLimit = size;

  for (let outer = 0; outer < outerLimit; outer++) {
    let currentSeq = [];
    let startRow = isHorizontal ? outer : 0;
    let startCol = isHorizontal ? 0 : outer;

    for (let inner = 0; inner < innerLimit; inner++) {
      const row = isHorizontal ? outer : inner;
      const col = isHorizontal ? inner : outer;
      const cell = grid[row][col];

      if (cell !== null) {
        if (currentSeq.length === 0) {
          startRow = row;
          startCol = col;
        }
        currentSeq.push(cell);
      } else {
        if (currentSeq.length > 0) {
          sequences.push({
            word: currentSeq.join(""),
            row: startRow,
            col: startCol,
            direction: isHorizontal ? "horizontal" : "vertical",
          });
          currentSeq = [];
        }
      }
    }

    // Don't forget the last sequence in the row/column
    if (currentSeq.length > 0) {
      sequences.push({
        word: currentSeq.join(""),
        row: startRow,
        col: startCol,
        direction: isHorizontal ? "horizontal" : "vertical",
      });
    }
  }

  return sequences;
}

/**
 * Get all word sequences on the grid (both horizontal and vertical)
 */
function getAllSequences(grid) {
  const horizontal = getSequencesInDirection(grid, true);
  const vertical = getSequencesInDirection(grid, false);
  return [...horizontal, ...vertical];
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that all sequences of 2+ letters on the grid are valid words
 * Single isolated letters are allowed if they're part of a word in the other direction
 */
function validateGrid(grid, dictionary, maxWordLength = 0, excludeSet = null) {
  const sequences = getAllSequences(grid);
  const words = [];

  for (const seq of sequences) {
    // Single letters are fine - they're part of perpendicular words
    if (seq.word.length === 1) {
      continue;
    }

    // Two-letter sequences are invalid (words must be 3+ letters)
    if (seq.word.length === 2) {
      return {
        valid: false,
        reason: `Two-letter sequence "${seq.word}" is not allowed`,
        words: [],
      };
    }

    // Check max word length constraint
    if (maxWordLength > 0 && seq.word.length > maxWordLength) {
      return {
        valid: false,
        reason: `"${seq.word}" exceeds max word length of ${maxWordLength}`,
        words: [],
      };
    }

    // Check if word is in the exclude list
    if (excludeSet && excludeSet.has(seq.word.toLowerCase())) {
      return {
        valid: false,
        reason: `"${seq.word}" is in the exclude list`,
        words: [],
      };
    }

    // Check if the word is in the dictionary
    if (!isValidWord(seq.word, dictionary)) {
      return {
        valid: false,
        reason: `"${seq.word}" is not a valid word`,
        words: [],
      };
    }

    words.push(seq);
  }

  return { valid: true, reason: null, words };
}

/**
 * Count letters on the grid
 */
function countLettersOnGrid(grid) {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get letter counts from a string
 */
function getLetterCounts(str) {
  const counts = {};
  for (const l of str.toLowerCase()) {
    counts[l] = (counts[l] || 0) + 1;
  }
  return counts;
}

/**
 * Get letter counts from grid
 */
function getGridLetterCounts(grid) {
  const counts = {};
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) {
        counts[cell] = (counts[cell] || 0) + 1;
      }
    }
  }
  return counts;
}

/**
 * Check if grid uses exactly the required letters (same counts)
 */
function gridMatchesLetters(grid, requiredLetters) {
  const gridCounts = getGridLetterCounts(grid);
  const requiredCounts = getLetterCounts(requiredLetters);

  // Check all required letters are present with correct counts
  for (const [letter, count] of Object.entries(requiredCounts)) {
    if (gridCounts[letter] !== count) {
      return false;
    }
  }

  // Check no extra letters on grid
  for (const [letter, count] of Object.entries(gridCounts)) {
    if (requiredCounts[letter] !== count) {
      return false;
    }
  }

  return true;
}

/**
 * Check if all tiles are connected (no islands)
 */
function areAllTilesConnected(grid) {
  const size = grid.length;
  const visited = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Find the first non-null cell
  let startRow = -1,
    startCol = -1;
  outer: for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== null) {
        startRow = r;
        startCol = c;
        break outer;
      }
    }
  }

  if (startRow === -1) {
    return true; // Empty grid
  }

  // BFS to visit all connected cells
  const queue = [[startRow, startCol]];
  let visitedCount = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    if (!isInBounds(r, c, size) || visited[r][c] || grid[r][c] === null) {
      continue;
    }

    visited[r][c] = true;
    visitedCount++;

    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  // Count total non-null cells
  const totalCells = countLettersOnGrid(grid);

  return visitedCount === totalCells;
}

// ============================================================================
// SOLUTION FINDER - Backtracking Algorithm
// ============================================================================

/**
 * Get letters currently on the grid
 */
function getLettersOnGrid(grid) {
  const letters = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) {
        letters.push(cell);
      }
    }
  }
  return letters.join("");
}

/**
 * Check if the grid has any letters
 */
function gridHasLetters(grid) {
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) return true;
    }
  }
  return false;
}

/**
 * Find valid placements for a word on the grid, checking remaining letter availability
 * Returns placements with the updated remaining letters
 */
function findValidPlacementsWithLetterCheck(
  grid,
  word,
  dictionary,
  mustIntersect,
  remainingLetters,
  maxWordLength = 0,
  excludeSet = null
) {
  const size = grid.length;
  const placements = [];
  const hasExistingLetters = gridHasLetters(grid);

  // Try all positions and directions
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (const isHorizontal of [true, false]) {
        // First check if the word can be placed (basic grid constraints)
        const newGrid = tryPlaceWord(grid, word, row, col, isHorizontal);

        if (!newGrid) {
          continue;
        }

        // Calculate which letters come from remaining vs intersections
        let intersectionCount = 0;
        const lettersNeeded = []; // Letters needed from remaining

        for (let i = 0; i < word.length; i++) {
          const r = isHorizontal ? row : row + i;
          const c = isHorizontal ? col + i : col;

          if (grid[r][c] !== null) {
            // This is an intersection - letter already on grid
            if (grid[r][c] === word[i]) {
              intersectionCount++;
            }
            // If grid[r][c] !== word[i], tryPlaceWord would have returned null
          } else {
            // Empty cell - need this letter from remaining
            lettersNeeded.push(word[i]);
          }
        }

        // Check if we have all needed letters in remaining
        let newRemaining = remainingLetters;
        let canPlace = true;

        for (const letter of lettersNeeded) {
          const idx = newRemaining.indexOf(letter);
          if (idx === -1) {
            canPlace = false;
            break;
          }
          newRemaining =
            newRemaining.slice(0, idx) + newRemaining.slice(idx + 1);
        }

        if (!canPlace) {
          continue;
        }

        // If there are existing letters, we must have at least one intersection
        if (hasExistingLetters && mustIntersect && intersectionCount === 0) {
          continue;
        }

        // Check if the grid is still potentially valid
        const validation = validateGrid(
          newGrid,
          dictionary,
          maxWordLength,
          excludeSet
        );

        if (validation.valid) {
          // Also ensure all tiles are connected
          if (areAllTilesConnected(newGrid)) {
            placements.push({
              grid: newGrid,
              row,
              col,
              direction: isHorizontal ? "horizontal" : "vertical",
              intersections: intersectionCount,
              newRemaining: newRemaining,
            });
          }
        }
      }
    }
  }

  // Sort by intersection count (more intersections = better, uses fewer remaining letters)
  placements.sort((a, b) => b.intersections - a.intersections);

  return placements;
}

/**
 * Main backtracking solver
 */
function solve(
  letters,
  gridSize,
  maxSolutions,
  dictionary,
  maxWordLength = 0,
  excludeWords = []
) {
  const solutions = [];
  const allLetters = letters.toLowerCase();
  const requiredLetterCounts = getLetterCounts(allLetters);

  // Create a Set of excluded words for fast lookup
  const excludeSet = new Set(excludeWords.map((w) => w.toLowerCase()));

  // Reset timeout state
  searchStartTime = Date.now();
  isTimedOut = false;

  // Find all valid words and filter out excluded ones
  let validWords = findAllValidWords(allLetters, dictionary, maxWordLength);
  const totalWordsBeforeFilter = validWords.length;

  if (excludeWords.length > 0) {
    validWords = validWords.filter(
      (word) => !excludeSet.has(word.toLowerCase())
    );
  }

  if (validWords.length === 0) {
    console.log("No valid words can be formed from the given letters.");
    return { solutions: [], timedOut: false };
  }

  // Sort words by length (longest first) for better pruning
  validWords.sort((a, b) => b.length - a.length);

  // Display word count info
  if (excludeWords.length > 0) {
    console.log(
      `Found ${totalWordsBeforeFilter} valid words, ${
        validWords.length
      } after excluding: ${excludeWords.join(", ")}`
    );
  } else {
    console.log(
      `Found ${validWords.length} valid words from letters "${allLetters}"`
    );
  }
  console.log(`Looking for solutions on a ${gridSize}x${gridSize} grid...`);
  console.log(`Timeout: ${timeoutSeconds} seconds\n`);

  /**
   * Recursive backtracking function
   */
  function backtrack(grid, remainingLetters, placedWords, depth = 0) {
    // Check for timeout
    if (checkTimeout() || solutions.length >= maxSolutions) {
      return;
    }

    // Check if all letters are used
    if (remainingLetters.length === 0) {
      // Validate the final grid - must use exactly the required letters
      if (!gridMatchesLetters(grid, allLetters)) {
        return; // Grid doesn't have the right letter counts
      }

      const validation = validateGrid(
        grid,
        dictionary,
        maxWordLength,
        excludeSet
      );

      if (validation.valid && areAllTilesConnected(grid)) {
        // Check if this solution uses the same combination of words as an existing solution
        // Sort word names to create a unique key for this word combination
        const wordSet = validation.words
          .map((w) => w.word.toLowerCase())
          .sort()
          .join("|");
        const isDuplicate = solutions.some(
          (s) =>
            s.words
              .map((w) => w.word.toLowerCase())
              .sort()
              .join("|") === wordSet
        );

        if (!isDuplicate) {
          solutions.push({
            grid: cloneGrid(grid),
            words: validation.words,
          });
        }
        return;
      }
    }

    // Create letter count map for remaining letters
    const remainingCounts = getLetterCounts(remainingLetters);

    // Get letter counts currently on grid
    const gridCounts = getGridLetterCounts(grid);

    // Filter words that can be formed
    const candidateWords = [];

    for (const word of validWords) {
      // Skip if word is already placed
      if (placedWords.has(word)) {
        continue;
      }

      // Check if word can be formed:
      // - New cells need letters from remainingLetters
      // - Intersection cells use letters already on grid
      // We need to check if, for any valid placement, the word can be placed

      // Quick check: all letters in the word must either be in remaining or potentially on grid
      let canPotentiallyForm = true;
      const wordCounts = getLetterCounts(word);

      for (const [letter, needed] of Object.entries(wordCounts)) {
        const available =
          (remainingCounts[letter] || 0) + (gridCounts[letter] || 0);
        if (available < needed) {
          canPotentiallyForm = false;
          break;
        }
      }

      if (!canPotentiallyForm) {
        continue;
      }

      // Count how many letters could come from remaining
      let maxFromRemaining = 0;
      for (const [letter, needed] of Object.entries(wordCounts)) {
        maxFromRemaining += Math.min(needed, remainingCounts[letter] || 0);
      }

      // Word must use at least one remaining letter to make progress
      if (maxFromRemaining > 0) {
        candidateWords.push({ word, usesRemainingCount: maxFromRemaining });
      }
    }

    // Sort by how many remaining letters the word could use (descending)
    candidateWords.sort((a, b) => b.usesRemainingCount - a.usesRemainingCount);

    // Limit candidates at deeper levels to avoid explosion
    const maxCandidates =
      depth < 3 ? candidateWords.length : Math.min(candidateWords.length, 30);

    for (let i = 0; i < maxCandidates; i++) {
      const { word } = candidateWords[i];

      // Check for timeout periodically
      if (checkTimeout() || solutions.length >= maxSolutions) {
        return;
      }

      // Find all valid placements for this word (must intersect if not first word)
      const mustIntersect = gridHasLetters(grid);
      const placements = findValidPlacementsWithLetterCheck(
        grid,
        word,
        dictionary,
        mustIntersect,
        remainingLetters,
        maxWordLength,
        excludeSet
      );

      // Limit placements to avoid explosion
      const maxPlacements =
        depth < 3 ? placements.length : Math.min(placements.length, 15);

      for (let j = 0; j < maxPlacements; j++) {
        const placement = placements[j];

        if (checkTimeout() || solutions.length >= maxSolutions) {
          return;
        }

        const newPlacedWords = new Set(placedWords);
        newPlacedWords.add(word);

        backtrack(
          placement.grid,
          placement.newRemaining,
          newPlacedWords,
          depth + 1
        );
      }
    }
  }

  // Start with the first word
  const emptyGrid = createEmptyGrid(gridSize);

  // Filter and sort starting words - prioritize longer words that can be formed from available letters
  const startingWords = validWords.filter((word) => {
    const availableCounts = { ...requiredLetterCounts };
    for (const l of word) {
      if (!availableCounts[l] || availableCounts[l] <= 0) {
        return false;
      }
      availableCounts[l]--;
    }
    return true;
  });

  // Limit starting words to the top longest ones
  const maxStartingWords = Math.min(startingWords.length, 50);

  // Try each word as a starting word
  for (let wordIdx = 0; wordIdx < maxStartingWords; wordIdx++) {
    const startWord = startingWords[wordIdx];

    if (checkTimeout() || solutions.length >= maxSolutions) {
      break;
    }

    // Calculate remaining letters after placing this word
    let remaining = allLetters;
    for (const letter of startWord) {
      const idx = remaining.indexOf(letter);
      if (idx !== -1) {
        remaining = remaining.slice(0, idx) + remaining.slice(idx + 1);
      }
    }

    // Try all valid starting positions for this word
    for (const isHorizontal of [true, false]) {
      // For starting word, try positions that leave room for other words
      const maxRow = isHorizontal ? gridSize : gridSize - startWord.length + 1;
      const maxCol = isHorizontal ? gridSize - startWord.length + 1 : gridSize;

      for (let row = 0; row < maxRow; row++) {
        for (let col = 0; col < maxCol; col++) {
          if (checkTimeout() || solutions.length >= maxSolutions) {
            break;
          }

          const grid = tryPlaceWord(
            emptyGrid,
            startWord,
            row,
            col,
            isHorizontal
          );

          if (grid) {
            const placedWords = new Set([startWord]);
            backtrack(grid, remaining, placedWords, 0);
          }
        }
      }
    }
  }

  return { solutions, timedOut: isTimedOut };
}

// ============================================================================
// OUTPUT FORMATTERS
// ============================================================================

/**
 * Format a grid as ASCII art
 */
function formatGridAsAscii(grid) {
  const size = grid.length;
  const lines = [];

  for (let row = 0; row < size; row++) {
    const cells = [];
    for (let col = 0; col < size; col++) {
      const cell = grid[row][col];
      cells.push(cell !== null ? cell.toUpperCase() : ".");
    }
    lines.push("  " + cells.join(" "));
  }

  return lines.join("\n");
}

/**
 * Format word placements as a list
 */
function formatWordList(words) {
  const lines = words.map(
    (w) =>
      `  ${w.word.toUpperCase()} (${w.direction}, row ${w.row}, col ${w.col})`
  );
  return lines.join("\n");
}

/**
 * Format a complete solution
 */
function formatSolution(solution, index) {
  const lines = [
    `Solution ${index}:`,
    "-".repeat(40),
    formatGridAsAscii(solution.grid),
    "",
    "Words:",
    formatWordList(solution.words),
    "",
  ];

  return lines.join("\n");
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

function printUsage() {
  console.log(`
Grid Word Solution Generator
============================

Generates crossword-style solutions for arranging letters on a square grid.

Usage:
  node generate-solutions.js --letters <letters> [options]

Options:
  -l, --letters <string>       Letters to arrange (required)
  -g, --gridSize <number>      Size of the square grid (default: ${DEFAULT_GRID_SIZE})
  -m, --maxSolutions <number>  Maximum solutions to find (default: ${DEFAULT_MAX_SOLUTIONS})
  -w, --maxWordLength <number> Maximum word length allowed (default: no limit)
  -e, --exclude <words>        Comma-separated words to exclude from solutions
  -t, --timeout <number>       Search timeout in seconds (default: ${DEFAULT_TIMEOUT_SECONDS})
  -h, --help                   Show this help message

Examples:
  node generate-solutions.js --letters "catdog"
  node generate-solutions.js -l "catdog" -g 4
  node generate-solutions.js -l "catdog" -g 4 -w 4
  node generate-solutions.js -l "catdog" -e "coat,coda"
  node generate-solutions.js --letters "catdog" --exclude "coat,dago,toga"
  node generate-solutions.js -l "catdog" -g 4 -m 10 -t 30

Rules:
  - All letters must be used exactly once
  - Words must be at least ${MIN_WORD_LENGTH} letters long
  - All horizontal/vertical letter sequences must form valid words
  - All letters must be connected (no islands)
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    letters: null,
    gridSize: DEFAULT_GRID_SIZE,
    maxSolutions: DEFAULT_MAX_SOLUTIONS,
    maxWordLength: DEFAULT_MAX_WORD_LENGTH,
    excludeWords: [],
    timeout: DEFAULT_TIMEOUT_SECONDS,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "-l":
      case "--letters":
        if (nextArg) {
          parsed.letters = nextArg.toLowerCase().replace(/[^a-z]/g, "");
          i++;
        }
        break;
      case "-g":
      case "--gridSize":
        if (nextArg) {
          parsed.gridSize = parseInt(nextArg, 10);
          i++;
        }
        break;
      case "-m":
      case "--maxSolutions":
        if (nextArg) {
          parsed.maxSolutions = parseInt(nextArg, 10);
          i++;
        }
        break;
      case "-w":
      case "--maxWordLength":
        if (nextArg) {
          parsed.maxWordLength = parseInt(nextArg, 10);
          i++;
        }
        break;
      case "-e":
      case "--exclude":
        if (nextArg) {
          // Parse comma-separated list of words, trim whitespace, convert to lowercase
          parsed.excludeWords = nextArg
            .split(",")
            .map((w) => w.trim().toLowerCase())
            .filter((w) => w.length > 0);
          i++;
        }
        break;
      case "-t":
      case "--timeout":
        if (nextArg) {
          parsed.timeout = parseInt(nextArg, 10);
          i++;
        }
        break;
      case "-h":
      case "--help":
        parsed.help = true;
        break;
      default:
        // Support legacy positional argument for letters if no flag is used
        if (!arg.startsWith("-") && !parsed.letters) {
          parsed.letters = arg.toLowerCase().replace(/[^a-z]/g, "");
        }
        break;
    }
  }

  return parsed;
}

/**
 * Calculate recommended minimum grid size for given number of letters
 */
function getRecommendedGridSize(letterCount) {
  // A crossword typically needs more space than just the letter count
  // because words intersect and there are empty spaces
  if (letterCount <= 8) return 4;
  if (letterCount <= 12) return 5;
  if (letterCount <= 16) return 6;
  if (letterCount <= 20) return 7;
  if (letterCount <= 25) return 8;
  return Math.ceil(Math.sqrt(letterCount * 1.5));
}

function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  if (parsed.help || args.length === 0) {
    printUsage();
    process.exit(parsed.help ? 0 : 1);
  }

  const {
    letters,
    gridSize,
    maxSolutions,
    maxWordLength,
    excludeWords,
    timeout,
  } = parsed;

  // Set global timeout
  timeoutSeconds = timeout;

  // Validation
  if (!letters || letters.length === 0) {
    console.error("Error: Please provide letters with --letters or -l flag.");
    printUsage();
    process.exit(1);
  }

  if (isNaN(gridSize) || gridSize < 3) {
    console.error("Error: Grid size must be a number >= 3.");
    process.exit(1);
  }

  if (gridSize * gridSize < letters.length) {
    console.error(
      `Error: Grid size ${gridSize}x${gridSize} (${
        gridSize * gridSize
      } cells) is too small for ${letters.length} letters.`
    );
    process.exit(1);
  }

  if (isNaN(maxSolutions) || maxSolutions < 1) {
    console.error("Error: maxSolutions must be a positive number.");
    process.exit(1);
  }

  if (isNaN(timeout) || timeout < 1) {
    console.error("Error: timeout must be a positive number.");
    process.exit(1);
  }

  // Check if grid size is reasonable for the number of letters
  const recommendedSize = getRecommendedGridSize(letters.length);
  if (gridSize < recommendedSize) {
    console.warn(
      `Warning: Grid size ${gridSize} may be too small for ${letters.length} letters.`
    );
    console.warn(`Recommended minimum grid size: ${recommendedSize}\n`);
  }

  console.log("Loading dictionary...");
  const dictionary = loadDictionary();
  console.log(
    `Dictionary loaded with ${Object.keys(dictionary).length} words.\n`
  );

  const startTime = Date.now();
  const result = solve(
    letters,
    gridSize,
    maxSolutions,
    dictionary,
    maxWordLength,
    excludeWords
  );
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (result.timedOut) {
    console.log(`\n⏱️  Search timed out after ${timeout} seconds.`);
  }

  if (result.solutions.length === 0) {
    console.log("No solutions found.");
    if (result.timedOut) {
      console.log("Try increasing the timeout or using a larger grid size.");
    }
  } else {
    console.log(`Found ${result.solutions.length} solution(s):\n`);

    result.solutions.forEach((solution, index) => {
      console.log(formatSolution(solution, index + 1));
    });
  }

  console.log(`Search completed in ${elapsed} seconds.`);
}

main();
