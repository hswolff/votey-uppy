import { NextApiRequest, NextApiResponse } from 'next';
import { SessionUser } from 'lib/data-types';
import { getItemById, updateItemById } from 'db/item-dao';
import { canBeEdited } from 'db/ItemModel';
import { getUserFromSession } from 'db/user-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const itemId = req.query.itemId as string;

  const item = await getItemById(itemId);

  if (req.method === 'GET') {
    return res.status(200).json(item);
  }

  if (req.method === 'PUT') {
    let sessionUser: SessionUser;
    try {
      sessionUser = await getUserFromSession({ req });
    } catch {
      res.status(401).end();
      return;
    }

    const canEdit = canBeEdited(item, sessionUser);

    if (!canEdit) {
      res.status(403).end();
      return;
    }

    const isAdmin = sessionUser.role === 'admin';

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

    // Don't allow non-admins to change the status of an Item
    if (!isAdmin) {
      delete updates.status;
    }

    return res.status(200).json(await updateItemById(itemId, updates));
  }

  res.end();
};
