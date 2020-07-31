import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useAddItem, useClearItems } from 'hooks/api-hooks';

export default function AddItemForm() {
  const [session] = useSession();

  const [title, setTitle] = useState('');
  const [mutate] = useAddItem();
  const [clearItems] = useClearItems();

  const submitForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    mutate({
      title,
      description: `Thank you ${session.user.name} for the idea!`,
    });
    setTitle('');
  };

  if (!session) {
    return null;
  }

  return (
    <form
      className="flex flex-col mx-auto max-w-sm border border-gray-400 rounded p-2"
      onSubmit={submitForm}
    >
      <input
        type="text"
        className="border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex flex-row  mt-2">
        <button
          className={`${buttonStyles} flex-grow`}
          type="submit"
          onClick={submitForm}
        >
          Add
        </button>
        <button
          type="button"
          className={`${buttonStyles} ml-2`}
          onClick={clearItems}
        >
          X
        </button>
      </div>
    </form>
  );
}

const buttonStyles = 'p-1 border bg-gray-400 shadow-sm';
