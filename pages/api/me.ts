import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromSession } from 'data/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user;

  try {
    user = await getUserFromSession({ req });
  } catch {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json(user);
  }

  if (req.method === 'POST') {
    res.status(401).end();
    return;
  }
};
