import { getDatabase } from './database';
import {
  Item,
  ItemQueryFilters,
  ItemStatus,
  SessionUser,
} from 'lib/data-types';
import { InsertOneWriteOpResult, ObjectId } from 'mongodb';
import markdownToHtml from 'lib/markdownToHtml';

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

export async function getAllItems({
  status,
  category,
  sort,
}: ItemQueryFilters): Promise<Item[]> {
  const db = await getDatabase();
  const collection = db.collection('items');

  const query: Record<string, string> = {};

  query.status = status != null ? status : ItemStatus.Open;

  if (category) {
    query.category = category;
  }

  let sortQuery: Record<string, number> = { _id: -1 };
  if (sort) {
    const isDesc = sort[0] === '-';
    const key = isDesc ? sort.slice(1) : sort;
    sortQuery = { [key]: isDesc ? -1 : 1 };
  }

  const items = await collection
    .aggregate([
      { $match: query },
      { $sort: sortQuery },
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

export async function createItem(
  newItem: Pick<
    Item,
    'title' | 'description' | 'category' | 'createdBy' | 'status'
  >
): Promise<InsertOneWriteOpResult<Item>> {
  const dateNow = new Date();

  const status = newItem.status || ItemStatus.Pending;

  const item: Omit<Item, '_id'> = {
    ...newItem,
    descriptionHtml: await markdownToHtml(newItem.description),
    created: dateNow,
    updated: dateNow,
    status,
    votes: [],
    changes: {
      status: [
        {
          timestamp: dateNow,
          newValue: status,
        },
      ],
    },
  };

  const db = await getDatabase();
  const collection = db.collection('items');

  return await collection.insertOne(item);
}

export async function updateItemById(
  itemId: string,
  updates: Partial<Item>
): Promise<Item> {
  const itemObjectId = new ObjectId(itemId);

  const db = await getDatabase();
  const collection = db.collection('items');

  const { changes, ...newUpdates } = updates;

  const queryUpdates: Record<string, any> = {
    $set: {
      ...newUpdates,
      descriptionHtml: await markdownToHtml(updates?.description),
    },
  };

  const existingItem = await collection.findOne<Item>({ _id: itemObjectId });

  // Only add a new status change when it actually changes.
  if (
    existingItem &&
    existingItem.changes.status[existingItem.changes.status.length - 1]
      .newValue !== newUpdates.status
  ) {
    queryUpdates['$push'] = {
      'changes.status': {
        timestamp: new Date(),
        newValue: updates.status,
      },
    };
  }

  return (await collection.findOneAndUpdate(
    { _id: itemObjectId },
    queryUpdates
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
