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

export type ItemStatus =
  | 'pending'
  | 'open'
  | 'accepted'
  | 'declined'
  | 'completed';

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
  role: 'admin';
}

export interface FormItem extends Pick<Item, 'title' | 'description'> {
  category: ItemCategory | null;
}

export interface ItemQueryFilters {
  category?: ItemCategory;
  userId?: string;
  status?: ItemStatus;
}
