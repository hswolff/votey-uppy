import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'db/user-dao';
import { getItemsCreatedByUser, getVotesForUser } from 'db/item-dao';
import { Item, SessionUser } from 'lib/data-types';

export interface MeApiResponse extends SessionUser {
  votes: Item[];
  created: Item[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;

  try {
    user = await getUserFromSession({ req });
  } catch {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const itemsVotedFor = await getVotesForUser(user.id);
    const itemsCreatedBy = await getItemsCreatedByUser(user.id);

    const response: MeApiResponse = {
      ...user,
      votes: itemsVotedFor,
      created: itemsCreatedBy,
    };

    return res.status(200).json(response);
  }

  if (req.method === 'POST') {
    res.status(401).end();
    return;
  }
};
