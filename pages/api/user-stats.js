import faunadb from 'faunadb';
import { getSession } from "next-auth/react";

const ANON_USER = 'anon';

export default async function handler(req, res) {

  const session = await getSession({ req })

  if (!session) {
    return res.status(404).json({
      message: 'User is not signed in.',
    });
  }

  const { email } = session.user;

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
    domain: 'db.us.fauna.com',
  });

  // Check and see if the doc exists.
  const doesDocExist = await client.query(
    q.Exists(q.Match(q.Index('stats_by_user'), email))
  );

  if (!doesDocExist) {
    await client.query(
      q.Create(q.Collection('user_stats'), {
        data: { solvedCount: 0, email },
      })
    );
  }

  // Fetch the document for-real
  const document = await client.query(
    q.Get(q.Match(q.Index('stats_by_user'), email))
  );

  if (req.method === 'POST') {
    await client.query(
      q.Update(document.ref, {
        data: {
          solvedCount: document.data.solvedCount + 1
        },
      })
    );

    return res.status(200).json({
      solvedCount: document.data.solvedCount + 1
    });
  }

  return res.status(200).json({
    solvedCount: document.data.solvedCount
  });
}