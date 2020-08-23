import { NextApiRequest, NextApiResponse } from 'next';
import { getItemById, updateItemById } from 'services/item-dao';
import { getUserFromSession } from 'services/user-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const itemId = req.query.itemId as string;

  if (req.method === 'GET') {
    return res.status(200).json(await getItemById(itemId));
  }

  if (req.method === 'PUT') {
    let user;
    let userIsAdmin = false;
    try {
      user = await getUserFromSession({ req });
      userIsAdmin = user.role === 'admin';
    } catch {
      res.status(401).end();
      return;
    }

    if (!userIsAdmin) {
      res.status(403).end();
      return;
    }

    const updates = JSON.parse(req.body);

    ['_id', 'created', 'votes', 'createdBy'].forEach((key) => {
      delete updates[key];
    });

    const missingValue = ['title', 'description', 'category', 'status'].some(
      (key) => key == null
    );

    if (missingValue) {
      res.status(400).json({ status: 'missing required value' });
    }

    updates.updated = new Date();

    return res.status(200).json(await updateItemById(itemId, updates));
  }

  res.end();
};
