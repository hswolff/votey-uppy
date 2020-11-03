import classNames from 'classnames';
import Link from 'next/link';
import { Item as ItemInterface } from 'lib/data-types';
import { useAddVote, useRemoveVote, useSessionUser } from 'lib/api-hooks';
import { DateTime } from 'luxon';
import { Card } from './Typography';
import { canBeEdited } from 'db/ItemModel';

export default function Item({ item }: { item: ItemInterface }) {
  const [sessionUser] = useSessionUser();

  const hasVoted =
    item.votes.find((vote) => vote.userId === sessionUser?._id) != null;

  const canEdit = canBeEdited(item, sessionUser);

  const [addVote, addData] = useAddVote(item._id);
  const [removeVote, removeData] = useRemoveVote(item._id);

  const isLoading = addData.isLoading || removeData.isLoading;

  return (
    <Card className="flex flex-col sm:flex-row">
      <div
        data-testid="vote-wrapper"
        className="flex flex-col justify-start mr-4 pr-4 text-center border-r border-purple-100"
      >
        <button
          className={classNames(
            'text-purple-400 relative transition-colors duration-150 text-4xl cursor-pointer',
            {
              'hover:text-purple-500': !isLoading,
              'animate-bounce': isLoading,
              'text-purple-700': hasVoted,
            }
          )}
          onClick={hasVoted ? removeVote : addVote}
          disabled={isLoading}
        >
          <Arrow />
        </button>
        <div
          className={classNames(
            'text-purple-100 bg-purple-400 font-bold rounded mt-2',
            {
              'bg-purple-700': hasVoted,
            }
          )}
        >
          {item.votes.length}
        </div>
      </div>
      <div data-testid="item-content" className="content flex-grow">
        <div className="relative font-bold leading-4">
          <Link href={`/item/${item._id}`}>
            <a>{item.title}</a>
          </Link>
          {canEdit && (
            <Link href={`/item/${item._id}/edit`}>
              <a>
                <button className="absolute right-0">✎</button>
              </a>
            </Link>
          )}
        </div>
        <div className="opacity-75 py-2 whitespace-pre-line">
          {item.description}
        </div>
        <div className="metadata opacity-50 text-sm space-x-2">
          <span>
            Created{' '}
            {DateTime.fromISO(item.created).toLocaleString(DateTime.DATE_FULL)}
            {item.user && ` by ${item.user.username}`}
          </span>
          <span>&#8226;</span>
          <span className="inline-block">{item.category}</span>
          <span>&#8226;</span>
          <span>{item.status}</span>
        </div>
      </div>
    </Card>
  );
}

const Arrow = ({ outline = false }) => (
  <svg
    stroke="currentColor"
    fill={outline ? 'transparent' : 'currentColor'}
    strokeWidth={outline ? '1' : '0'}
    version="1.1"
    viewBox="0 0 16 16"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.707 6.293l-5-5c-0.39-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-9.586l3.293 3.293c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.391 0.391-1.024 0-1.414z"></path>
  </svg>
);
