import { NextApiRequest, NextApiResponse } from 'next';
import faker from 'faker';
import { Item, ItemCategory } from 'data/data-types';
import { getDatabase } from 'data/database';
import { getUserFromSession } from 'data/user-dao';
import { getAllItems } from 'data/item-dao';

function generateItem({
  title = faker.lorem.words(),
  description = faker.lorem.paragraph(),
  createdBy = faker.random.uuid(),
} = {}): Partial<Item> {
  return {
    title,
    description,
    created: new Date(),
    updated: new Date(),
    category: faker.random.arrayElement([
      ItemCategory.Tutorial,
      ItemCategory.Opinion,
      ItemCategory.Vlog,
    ]),
    createdBy,
    status: faker.random.arrayElement([
      'open',
      'accepted',
      'declined',
      'completed',
    ]),
    votes: [],
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDatabase();
  const collection = db.collection('items');

  if (req.method === 'GET') {
    return res.status(200).json(await getAllItems());
  }

  if (req.method === 'POST') {
    let user;

    try {
      user = await getUserFromSession({ req });
    } catch {
      res.status(401).end();
      return;
    }

    const { title, description } = JSON.parse(req.body);

    if (!title || !description) {
      res.status(400).json({ status: 'malformed content' });
      return;
    }

    const newItem = generateItem({ title, description, createdBy: user._id });

    const { result } = await collection.insertOne(newItem);

    if (!result.ok) {
      res.status(500).json({ status: 'unable to add item' });
      return;
    }

    return res.status(201).json({ status: 'created' });
  }

  if (req.method === 'DELETE') {
    res.end();
  }
};
