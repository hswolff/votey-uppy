import { getDatabase } from './database';
import { Item, ItemStatus, SessionUser } from './data-types';
import { ObjectId } from 'mongodb';

const populateCreatedByAggregateStages = [
  {
    $lookup: {
      from: 'users',
      foreignField: '_id',
      localField: 'createdBy',
      as: 'createdBy_user',
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$createdBy_user', 0] },
    },
  },
  { $project: { createdBy_user: 0 } },
];

interface GetAllItems {
  onlyPending: boolean;
}
export async function getAllItems({
  onlyPending = false,
}: GetAllItems): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  const query = onlyPending
    ? { status: ItemStatus.Pending }
    : { status: { $ne: ItemStatus.Pending } };

  const items = await collection
    .aggregate([
      { $match: query },
      { $sort: { _id: -1 } },
      ...populateCreatedByAggregateStages,
    ])
    .toArray();

  return items as Item[];
}

export async function getItemById(itemId: string): Promise<Item> {
  const db = await getDatabase();
  const collection = db.collection('items');

  const item = (await collection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(itemId),
        },
      },
      ...populateCreatedByAggregateStages,
    ])
    .toArray()) as Item[];

  return item[0];
}

export async function updateItemById(
  itemId: string,
  updates: Partial<Item>
): Promise<Item> {
  const db = await getDatabase();
  const collection = db.collection('items');

  return (await collection.findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    {
      $set: updates,
    }
  )) as Item;
}

export async function getItemsCreatedByUser(userId: string): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  const item = (await collection
    .aggregate([
      {
        $match: {
          createdBy: new ObjectId(userId),
        },
      },
      { $sort: { _id: -1 } },
      ...populateCreatedByAggregateStages,
    ])
    .toArray()) as Item[];

  return item;
}

export async function getVotesForUser(userId: string): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  return (await collection
    .find({ 'votes.userId': new ObjectId(userId) }, { sort: { _id: -1 } })
    .toArray()) as Item[];
}

export async function addVoteToItem({
  itemId: itemIdString,
  user,
}: {
  itemId: string;
  user: SessionUser;
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
  user: SessionUser;
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
