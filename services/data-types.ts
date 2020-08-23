type ObjectId = string;

export enum ItemCategory {
  Tutorial = 'Tutorial',
  Opinion = 'Opinion',
  Vlog = 'Vlog',
}

export interface ItemVote {
  userId: ObjectId;
  created: Date;
}

export enum ItemStatus {
  Pending = 'pending',
  Open = 'open',
  Accepted = 'accepted',
  Declined = 'declined',
  Completed = 'completed',
}

export interface Item {
  _id: ObjectId;
  title: string;
  description: string;
  created: Date;
  updated: Date;
  category: ItemCategory;
  createdBy: ObjectId;
  status: ItemStatus;
  votes: ItemVote[];
}

export interface User {
  _id: ObjectId;
  name: string;
  username: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  role?: 'admin';
}

export interface FormItem extends Pick<Item, 'title' | 'description'> {
  category: ItemCategory | null;
  status?: ItemStatus;
}

export interface ItemQueryFilters {
  category?: ItemCategory;
  userId?: string;
  status?: ItemStatus;
}
