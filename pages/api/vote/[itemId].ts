import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'db/user-dao';
import { addVoteToItem, removeVoteFromItem } from 'db/item-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;

  try {
    user = await getUserFromSession({ req });
  } catch {
    res.status(401).end();
    return;
  }

  const itemId = req.query.itemId as string;

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  if (req.method === 'POST') {
    const { result } = await addVoteToItem({
      itemId,
      user,
    });

    res.status(201).send(result.ok);
    return;
  }

  if (req.method === 'DELETE') {
    const { result } = await removeVoteFromItem({
      itemId,
      user,
    });

    res.status(200).send(result.ok);
    return;
  }

  res.status(404).end();
};
