const faunadb = require('faunadb');
const { Client, query: q } = faunadb;

// FaunaDB credentials and collection details
const FAUNA_SECRET = "fnAEdQW_GnAAQCw16faDBN7YVLeVT6G4XnJQBcBW";
const FAUNA_COLLECTION = "puzzles";
const FAUNA_ENDPOINT = "db.us.fauna.com";

// Function to increment date
function incrementDate(dateStr, days = 1) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Function to fetch documents from FaunaDB
async function fetchDocuments() {
    const client = new Client({ secret: FAUNA_SECRET });
    try {
        const response = await client.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection(FAUNA_COLLECTION))),
                q.Lambda('X', q.Get(q.Var('X')))
            )
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
}

async function fetchAllDocuments() {
  const client = new Client({ secret: FAUNA_SECRET });

  let allDocuments = [];

  try {
      let after = null;
      let hasNextPage = true;

      while (hasNextPage) {
          const result = await client.query(
              q.Map(
                  q.Paginate(q.Documents(q.Collection(FAUNA_COLLECTION)), after ? { after } : undefined),
                  q.Lambda(['ref'], q.Get(q.Var('ref')))
              )
          );

          allDocuments = allDocuments.concat(result.data);
          after = result.after;
          hasNextPage = !!after;
      }

      return allDocuments;
  } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
  }
}

// Function to copy documents with incremented dates
function copyDocuments(documents) {
    const today = new Date().toISOString().split('T')[0];
    const newDocuments = documents.map((document, index) => ({
        date: incrementDate(today, index),
        letters: document.data.letters,
        words: document.data.words
    }));
    return newDocuments;
}

// Function to insert new documents into FaunaDB
async function insertDocuments(newDocuments) {
    const client = new Client({ secret: FAUNA_SECRET });
    for (const document of newDocuments) {
        try {
            await client.query(
                q.Create(q.Collection(FAUNA_COLLECTION), {
                    data: document
                })
            );
            console.log("Document inserted:", document);
        } catch (error) {
            console.error("Error inserting document:", error);
        }
    }
}

// Main function
async function main() {
    const documents = await fetchAllDocuments();
    const newDocuments = copyDocuments(documents);
    await insertDocuments(newDocuments);
}

main();