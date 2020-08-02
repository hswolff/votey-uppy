import { NextApiRequest, NextApiResponse } from 'next';
import faker from 'faker';
import Item, { ItemCategory } from 'data/data-types';

faker.seed(1);

function generateItem({ title = null, description = null } = {}): Item {
  return {
    _id: faker.random.uuid(),
    title: title ?? faker.lorem.words(),
    description: description ?? faker.lorem.paragraph(),
    created: faker.date.past(),
    updated: faker.date.past(),
    category: faker.random.arrayElement([
      ItemCategory.Tutorial,
      ItemCategory.Opinion,
      ItemCategory.Vlog,
    ]),
    createdBy: faker.random.uuid(),
    status: faker.random.arrayElement([
      'open',
      'accepted',
      'declined',
      'completed',
    ]),
    votes: [],
  };
}

let postRequests: Item[] = [];

export default (req: NextApiRequest, res: NextApiResponse) => {
  const items = postRequests
    // @ts-expect-error
    .concat([...Array(10).keys()])
    // @ts-ignore
    .map((item) => generateItem(typeof item === 'number' ? undefined : item));

  if (req.method === 'GET') {
    return res.status(200).json(items);
  }

  if (req.method === 'DELETE') {
    postRequests = [];
    return res.status(200).send('deleted');
  }

  const parsedBody = JSON.parse(req.body);

  postRequests.unshift(parsedBody);

  // don't memory leak
  if (postRequests.length > 9) {
    postRequests = [];
  }

  res.status(200).send('added');
};
