import { NextApiRequest, NextApiResponse } from 'next';

import faker from 'faker';

faker.seed(1);

function generateItem({ title = null, description = null } = {}) {
  return {
    _id: faker.random.uuid(),
    title: title ?? faker.lorem.words(),
    description: description ?? faker.lorem.paragraph(),
    created: faker.date.past().toUTCString(),
    updated: faker.date.past().toUTCString(),
    category: faker.random.arrayElement(['Tutorial', 'Opinion', 'Vlog']),
    createdBy: faker.random.uuid(),
    status: faker.random.arrayElement([
      'open',
      'accepted',
      'declined',
      'completed',
    ]),
    votes: faker.random.number(100),
    // votes: {
    //   up: [],
    //   down: [],
    // },
  };
}

let postRequests = [];

export default (req: NextApiRequest, res: NextApiResponse) => {
  const items = postRequests
    // @ts-expect-error
    .concat([...Array(10).keys()])
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
