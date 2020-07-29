import faker from 'faker';

faker.seed(1);

function generateItem() {
  return {
    _id: faker.random.uuid(),
    title: faker.lorem.words(),
    description: faker.lorem.paragraph(),
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

// @ts-expect-error
const items = [...Array(10).keys()].map((i) => generateItem());

function Item({ item }) {
  return (
    <div className="border border-gray-400 rounded-md shadow my-8 p-4 flex flex-col sm:flex-row hover:border-gray-500 ease-linear transition duration-150">
      <div className="mx-auto pr-4 text-center">
        <div className="text-4xl align-top sm:-mt-1">⬆️</div>
        <div className="border border-blue-800 bg-blue-300 rounded max-">
          {item.votes}
        </div>
      </div>
      <div className="content flex-grow">
        <div className="font-bold text-xl leading-7">{item.title}</div>
        <div className="py-2">{item.description}</div>
        <div className="metadata text-gray-700 text-sm">
          <span className="inline-block mr-4">{item.category}</span>
          <span>{item.created}</span>
        </div>
      </div>
    </div>
  );
}

export default function Content() {
  return (
    <ul className="container mx-auto my-2 max-w-6xl">
      {items.map((item) => (
        <li key={item.title}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}
