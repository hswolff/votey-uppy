import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from 'data/database';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).end();
    return;
  }

  const { accessToken } = session;

  const db = await getDatabase();

  const sessionDocument = await db
    .collection('sessions')
    .findOne({ accessToken });

  if (!sessionDocument) {
    res.status(401).end();
    return;
  }

  const userId = sessionDocument.userId;

  if (req.method === 'GET') {
    const user = await db.collection('users').findOne({ _id: userId });
    return res.status(200).json(user);
  }

  if (req.method === 'POST') {
    res.status(401).end();
    return;
  }
};
