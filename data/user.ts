import { getSession } from 'next-auth/client';
import { getDatabase } from './database';
import { NextApiRequest } from 'next';

export interface User {
  _id: string;
  name: string;
  username: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserFromSession({
  req,
}: {
  req: NextApiRequest;
}): Promise<User> {
  const session = await getSession({ req });

  if (!session) {
    throw new Error();
  }

  const { accessToken } = session;

  const db = await getDatabase();

  const sessionDocument = await db
    .collection('sessions')
    .findOne({ accessToken });

  if (!sessionDocument) {
    throw new Error();
  }

  const userId = sessionDocument.userId;

  const user = await db.collection('users').findOne({ _id: userId });

  if (!user) {
    throw new Error();
  }

  return user;
}
