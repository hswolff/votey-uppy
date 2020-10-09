import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'services/user-dao';
import { getItemsCreatedByUser, getVotesForUser } from 'services/item-dao';
import { Item, User } from 'services/data-types';

export interface MeApiResponse extends User {
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
    const itemsVotedFor = await getVotesForUser(user._id);
    const itemsCreatedBy = await getItemsCreatedByUser(user._id);

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
