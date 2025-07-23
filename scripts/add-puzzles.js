/**
 * Script to batch add new puzzles to the Supabase 'puzzles' table.
 *
 * What it does:
 * - Connects to Supabase using environment variables from the appropriate .env file.
 * - Fetches the most recent puzzle date from the database.
 * - Adds each puzzle from './puzzles-to-add.js' to the database, assigning each a date incremented by one day after the last puzzle.
 * - Each puzzle object should have a 'letters' property and optionally a 'words' property.
 *
 * How to use:
 * 1. Ensure you have a valid environment file with NEXT_PUBLIC_SUPABASE_URL and NEXT_SUPABASE_SERVICE_ROLE_KEY set.
 * 2. Add new puzzles to './puzzles-to-add.js' as an array of objects.
 * 3. Run this script from the command line:
 *    node scripts/add-puzzles.js [environment]
 *    where [environment] is 'dev' (default) or 'prod'
 * 4. The script will log the result and any errors to the console.
 */

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] || "dev"; // Default to 'dev' if no argument provided

// Validate environment parameter
if (!["dev", "prod"].includes(environment)) {
  console.error('Error: Environment must be either "dev" or "prod"');
  process.exit(1);
}

// Determine which environment file to use
let envFile;
if (environment === "dev") {
  envFile = ".env.dev";
} else {
  envFile = ".env.prod";
}

console.log(`Using environment: ${environment}`);
console.log(`Loading environment from: ${envFile}`);

require("dotenv").config({
  path: require("path").resolve(__dirname, `../${envFile}`),
});
const { createClient } = require("@supabase/supabase-js");
const puzzles = require("./puzzles-to-add");

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
);

async function getLastPuzzleDate() {
  const { data, error } = await supabase
    .from("puzzles")
    .select("date")
    .order("date", { ascending: false })
    .limit(1);

  console.log("data", data);
  console.log("error", error);

  if (error) {
    console.error("Error fetching last puzzle date:", error);
    return new Date(); // Default to today if error
  }

  if (data && data.length > 0) {
    return new Date(data[0].date);
  }

  return new Date(); // Default to today if no puzzles exist
}

async function addPuzzles(puzzles) {
  const lastDate = await getLastPuzzleDate();
  const puzzlesToInsert = puzzles.map((puzzle, index) => {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + index + 1); // Add days after the last puzzle

    return {
      letters: puzzle.letters,
      words: puzzle.words || null,
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };
  });

  const { data, error } = await supabase
    .from("puzzles")
    .insert(puzzlesToInsert)
    .select();

  if (error) {
    console.error("Error adding puzzles:", error);
    return;
  }

  console.log("Successfully added puzzles:");
  data.forEach((puzzle) => {
    console.log(
      `Date: ${puzzle.date}, Letters: ${puzzle.letters}, Text: ${
        puzzle.words || "N/A"
      }`
    );
  });
}

// Run the script
addPuzzles(puzzles);
