import ManageItemForm from 'components/ManageItemForm';
import Card, { Header } from 'components/Card';
import { signin, useSession } from 'next-auth/client';

export default function NewItem() {
  const [session] = useSession();
  return (
    <Card className="flex flex-col">
      <Header>Add New Item</Header>
      {session && <ManageItemForm />}
      {!session && (
        <button
          className="hover:text-purple-500"
          onClick={() => signin('github')}
        >
          sign in to add a new item
        </button>
      )}
    </Card>
  );
}
