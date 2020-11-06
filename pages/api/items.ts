import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { ItemCategory, ItemQueryFilters, ItemStatus } from 'lib/data-types';
import { getUserFromSession } from 'db/user-dao';
import { createItem, getAllItems } from 'db/item-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;
  let userIsAdmin = false;
  try {
    user = await getUserFromSession({ req });
    userIsAdmin = user.role === 'admin';
  } catch {} // eslint-disable-line no-empty

  if (req.method === 'GET') {
    const query = (req.query as unknown) as ItemQueryFilters;

    const filters: ItemQueryFilters = {};

    const status = query.status as ItemStatus;
    if (Object.values(ItemStatus).includes(status)) {
      filters.status = status;

      if (status === ItemStatus.Pending && !userIsAdmin) {
        delete filters.status;
      }
    }

    const category = query.category as ItemCategory;
    if (Object.values(ItemCategory).includes(category)) {
      filters.category = category;
    }

    filters.sort = query.sort;

    return res.status(200).json(await getAllItems(filters));
  }

  if (req.method === 'POST') {
    if (!user) {
      res.status(401).end();
      return;
    }

    const { title, description, category, status } = JSON.parse(req.body);

    if (!title || !description || !category) {
      res.status(400).json({ status: 'malformed content' });
      return;
    }

    const { result } = await createItem({
      title,
      description,
      category,
      createdBy: new ObjectId(user.id),
      status: userIsAdmin && status,
    });

    if (!result.ok) {
      res.status(500).json({ status: 'unable to add item' });
      return;
    }

    return res.status(201).json({ status: 'created' });
  }

  res.end();
};
