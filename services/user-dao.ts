import { getSession } from 'next-auth/client';
import { getDatabase } from './database';
import { NextApiRequest } from 'next';
import { SessionUser, User } from './data-types';
import { ObjectId } from 'mongodb';

export async function getUserFromSession({
  req,
}: {
  req: NextApiRequest;
}): Promise<SessionUser> {
  const session = await getSession({ req });

  if (!session) {
    throw new Error();
  }

  const sessionUser = (session.user as unknown) as SessionUser;

  return getUserFromId(sessionUser._id);
}

export async function getUserFromId(userId: string): Promise<User> {
  const db = await getDatabase();

  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}

export async function updateUser(
  userId: string,
  update: Record<string, any>
): Promise<User> {
  const db = await getDatabase();

  const opResult = await db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: update },
      { returnOriginal: false }
    );

  return opResult.value as User;
}
