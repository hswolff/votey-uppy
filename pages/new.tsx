import ManageItemForm from 'components/ManageItemForm';
import Card, { Header } from 'components/Card';

export default function NewItem() {
  return (
    <Card className="flex flex-col">
      <Header>Add New Item</Header>
      <ManageItemForm />
    </Card>
  );
}
