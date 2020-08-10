import { getSession } from 'next-auth/client';
import { getDatabase } from './database';
import { NextApiRequest } from 'next';
import { User } from './data-types';

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
