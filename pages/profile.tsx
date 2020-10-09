import { useMeData } from 'services/api-hooks';
import { Header, Header2, Card } from 'components/Typography';
import ItemList from 'components/ItemList';
import Loading from 'components/Loading';
import { Item, ItemStatus } from 'services/data-types';
import { useState } from 'react';

export default function Me() {
  const { isSuccess, isLoading, data } = useMeData();

  const content = () => {
    if (isLoading || !(isSuccess && data)) {
      return null;
    }

    const itemByStatus = data.created.reduce((acc, item) => {
      acc[item.status] = acc[item.status] || [];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc[item.status]!.push(item);
      return acc;
    }, {} as Record<ItemStatus, Item[] | undefined>);

    return (
      <div className="space-y-8">
        <Section
          title="Items You've Voted For"
          items={data.votes}
          defaultExpanded
        />
        <Section title="Pending Approval" items={itemByStatus.Pending} />
        <Section title="Completed Items" items={itemByStatus.Completed} />
        <Section title="All Items You've Submitted" items={data.created} />
      </div>
    );
  };

  return (
    <Card className="flex flex-col">
      <Header className="mb-6">Profile</Header>

      {isLoading && <Loading className="mx-auto text-purple-700 opacity-50" />}

      {content()}
    </Card>
  );
}

function Section({
  title,
  items,
  defaultExpanded = false,
}: {
  title: string;
  items?: Item[];
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (items?.length === 0) {
    return null;
  }

  return (
    <div>
      <Header2
        className="cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {title}
      </Header2>
      {expanded && (
        <div>
          <ItemList items={items} />
        </div>
      )}
    </div>
  );
}
