import faunadb from 'faunadb';

export default async function handler(req, res) {

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
    domain: 'db.us.fauna.com',
  });

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      message: 'Day slug not provided',
    });
  }

  // Check and see if the doc exists.
  const doesDocExist = await client.query(
    q.Exists(q.Match(q.Index('hits_by_slug'), slug))
  );

  if (!doesDocExist) {
    await client.query(
      q.Create(q.Collection('hits'), {
        data: { slug: slug, hits: 0 },
      })
    );
  }

  // Fetch the document for-real
  const document = await client.query(
    q.Get(q.Match(q.Index('hits_by_slug'), slug))
  );

  if (req.method === 'POST') {
    await client.query(
      q.Update(document.ref, {
        data: {
          hits: document.data.hits + 1,
        },
      })
    );

    return res.status(200).json({
      hits: document.data.hits + 1,
    });
  }

  return res.status(200).json({
    hits: document.data.hits,
  });
}