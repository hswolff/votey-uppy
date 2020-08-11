import { getDatabase } from './database';
import { Item, User } from './data-types';
import { ObjectId } from 'mongodb';

export async function getAllItems(): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  return await collection.find().sort({ _id: -1 }).toArray();
}

export async function getVotesForUser(userId: string): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  return await collection
    .find({ 'votes.userId': new ObjectId(userId) })
    .sort({ _id: -1 })
    .toArray();
}

export async function addVoteToItem({
  itemId: itemIdString,
  user,
}: {
  itemId: string;
  user: User;
}) {
  const db = await getDatabase();
  const collection = db.collection('items');

  const itemObjectId = new ObjectId(itemIdString);
  const userObjectId = new ObjectId(user._id);

  const existingVote = await collection
    .find({
      _id: itemObjectId,
      'votes.userId': userObjectId,
    })
    .count();

  if (existingVote) {
    throw new Error('Already voted');
  }

  return collection.updateOne(
    { _id: itemObjectId },
    {
      $push: {
        votes: {
          userId: userObjectId,
          created: new Date(),
        },
      },
    }
  );
}

export async function removeVoteFromItem({
  itemId: itemIdString,
  user,
}: {
  itemId: string;
  user: User;
}) {
  const db = await getDatabase();
  const collection = db.collection('items');

  const itemObjectId = new ObjectId(itemIdString);
  const userObjectId = new ObjectId(user._id);

  const existingVote = await collection
    .find({
      _id: itemObjectId,
      'votes.userId': userObjectId,
    })
    .count();

  if (!existingVote) {
    throw new Error('No vote found');
  }

  return await collection.updateOne(
    { _id: itemObjectId },
    {
      $pull: {
        votes: {
          userId: userObjectId,
        },
      },
    }
  );
}
