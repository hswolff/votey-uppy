import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'data/user-dao';
import { addVoteToItem } from 'data/item-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;

  try {
    user = await getUserFromSession({ req });
  } catch {
    res.status(401).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const itemId = req.query.itemId as string;

  const result = await addVoteToItem({ itemId, user });

  console.log(result);

  res.status(201).send('lol' + itemId);
};
