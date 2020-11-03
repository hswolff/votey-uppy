import { Item, ItemStatus, SessionUser } from 'lib/data-types';

export function canBeEdited(item: Item, sessionUser?: SessionUser | null) {
  if (!sessionUser) {
    return false;
  }

  const isAdmin = sessionUser.role === 'admin';

  // On backend these ObjectIds are instances and not just strings
  const itemCreatedByViewer =
    item.createdBy.toString() === sessionUser._id.toString();

  const isPending = item.status === ItemStatus.Pending;

  return isAdmin || (itemCreatedByViewer && isPending);
}
