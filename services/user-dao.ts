import { getSession } from 'next-auth/client';
import { getDatabase } from './database';
import { NextApiRequest } from 'next';
import { User } from './data-types';
import { ObjectId } from 'mongodb';

export async function getUserFromSession({
  req,
}: {
  req: NextApiRequest;
}): Promise<User> {
  const session = await getSession({ req });

  if (!session) {
    throw new Error();
  }

  return getUserFromId(session.user._id);
}

async function getUserFromAccessToken(accessToken: string): Promise<User> {
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

async function getUserFromId(userId: string): Promise<User> {
  const db = await getDatabase();

  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}
