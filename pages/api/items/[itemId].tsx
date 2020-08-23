import { NextApiRequest, NextApiResponse } from 'next';
import { getItemById } from 'services/item-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.end();
    return;
  }

  return res.status(200).json(await getItemById(req.query.itemId as string));
};
