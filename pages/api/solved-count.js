import faunadb from 'faunadb';
import { getSession } from "next-auth/react";

const ANON_USER = 'anon';

export default async function handler(req, res) {

  const session = await getSession({ req })
  let user;
  if (session?.user) {
    user = session.user;
  } else {
    user = ANON_USER;
  }

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
        data: { slug: slug, hits: 0, solveTimes: [] },
      })
    );
  }

  // Fetch the document for-real
  const document = await client.query(
    q.Get(q.Match(q.Index('hits_by_slug'), slug))
  );

  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const { timeTaken } = body;
    const obj = {
      timeTaken,
      solvedAt: new Date().toISOString(),
      user
    };

    const solveTimes = document.data.solveTimes || [];
    let newSolveTimes = [...solveTimes];

    // solve times should be sorted in increasing order
    // as soon as we find a time that is greater than the current time, insert before
    if (newSolveTimes.length > 0) {
      let added = false;
      for (let i = 0; i < newSolveTimes.length; i++) {
        if (newSolveTimes[i].timeTaken > timeTaken) {
          newSolveTimes.splice(i, 0, obj);
          added = true;
          break;
        }
      }
      if (!added) {
        newSolveTimes.push(obj);
      }
    } else {
      newSolveTimes.push(obj);
    }

    await client.query(
      q.Update(document.ref, {
        data: {
          hits: document.data.hits + 1,
          solveTimes: newSolveTimes
        },
      })
    );

    // filter out anonymous users
    // get top 10 solve times
    // only send users name and not email
    const filteredSolveTimes = newSolveTimes
      .filter(time => time.user !== ANON_USER)
      .slice(0, 10)
      .map(time => ({
        timeTaken: time.timeTaken,
        user: time.user.name,
        isUser: time.user.email === user.email
      }));

    return res.status(200).json({
      hits: document.data.hits + 1,
      solveTimes: filteredSolveTimes
    });
  }

  const solveTimes = document.data.solveTimes || [];
  // filter out anonymous users
  // only send users name and not email
  const filteredSolveTimes = solveTimes
    .filter(time => time.user !== ANON_USER)
    .slice(0, 10)
    .map(time => ({
      timeTaken: time.timeTaken,
      user: time.user.name,
      isUser: time.user.email === user.email
    }));

  return res.status(200).json({
    hits: document.data.hits,
    solveTimes: filteredSolveTimes
  });
}