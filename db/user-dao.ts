import { getSession } from 'next-auth/client';
import { getDatabase } from './database';
import { NextApiRequest } from 'next';
import { User } from 'lib/data-types';
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

  return getUserFromId(session.user.id);
}

export async function getUserFromId(userId: string): Promise<User> {
  const db = await getDatabase();

  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('No user found');
  }

  user.id = user._id.toString();

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

  const updatedUser = opResult.value as User;

  updatedUser.id = updatedUser._id.toString();

  return updatedUser;
}
