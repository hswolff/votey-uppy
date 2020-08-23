import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useAddItem } from 'services/api-hooks';
import { FormItem, ItemCategory } from 'services/data-types';

const initialState = {
  title: '',
  description: '',
  category: null,
};

export default function AddItemForm() {
  const [session] = useSession();

  const [formData, rawSetFormData] = useState<FormItem>(initialState);
  const setFormData = (next: Partial<FormItem>) =>
    rawSetFormData((current) => ({
      ...current,
      ...next,
    }));

  const [error, setError] = useState('');

  const [mutate, { isLoading: isLoadingMutation }] = useAddItem();

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isLoadingMutation) {
      return;
    }

    setError('');

    if (Object.values(formData).some((val) => !val)) {
      setError('Please fill out form');
      return;
    }

    mutate(formData);

    setFormData(initialState);
    setError('');
  };

  if (!session) {
    return null;
  }

  return (
    <form
      className="flex flex-col mx-auto max-w-sm border border-gray-400 rounded p-2"
      onSubmit={submitForm}
    >
      {error && <p>{error}</p>}
      <fieldset className="flex flex-col w-full mx-auto space-y-4">
        <input
          type="text"
          autoFocus
          className="border p-2"
          placeholder="title"
          value={formData.title}
          onChange={(e) => setFormData({ title: e.target.value })}
        />
        <textarea
          className="border p-2 resize-none"
          value={formData.description}
          placeholder="description"
          onChange={(e) => setFormData({ description: e.target.value })}
        />
        <select
          className="border"
          value={formData.category || ''}
          onChange={(e) =>
            setFormData({ category: e.target.value as ItemCategory })
          }
        >
          <option value="">Select category</option>
          {Object.entries(ItemCategory).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
      </fieldset>

      <div className="flex flex-row  mt-2">
        <button
          className="p-1 border bg-gray-400 shadow-sm flex-grow"
          type="submit"
          onClick={submitForm}
          disabled={isLoadingMutation}
        >
          Add
        </button>
      </div>
    </form>
  );
}
