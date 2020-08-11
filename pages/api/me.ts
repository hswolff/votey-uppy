import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'services/user-dao';
import { getVotesForUser } from 'services/item-dao';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;

  try {
    user = await getUserFromSession({ req });
  } catch {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const itemsVotedFor = await getVotesForUser(user._id);

    const response = {
      ...user,
      votes: itemsVotedFor,
    };

    return res.status(200).json(response);
  }

  if (req.method === 'POST') {
    res.status(401).end();
    return;
  }
};
