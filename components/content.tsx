import { Item as ItemInterface } from 'services/data-types';
import { useAddVote } from 'services/api-hooks';

export default function Content({ items }: { items: ItemInterface[] }) {
  return (
    <ul className="container mx-auto my-2 space-y-8">
      {items.map((item) => (
        <li key={item.title}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}

function Item({ item }: { item: ItemInterface }) {
  const [vote] = useAddVote(item._id);
  return (
    <div className="border border-gray-400 rounded-md shadow p-4 flex flex-col sm:flex-row hover:border-gray-500 ease-linear transition duration-150">
      <div className="mx-auto pr-4 text-center">
        <div
          className="text-4xl align-top sm:-mt-1 cursor-pointer"
          onClick={vote}
        >
          ⬆️
        </div>
        <div className="border border-blue-800 bg-blue-300 rounded">
          {item.votes.length}
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
