import * as yup from 'yup';
import { ObjectId } from 'mongodb';

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
  Pending = 'Pending',
  Open = 'Open',
  Declined = 'Declined',
  Completed = 'Completed',
}

export interface Item {
  _id: ObjectId;
  title: string;
  description: string;
  descriptionHtml: string;
  created: Date;
  updated: Date;
  category: ItemCategory;
  createdBy: ObjectId;
  status: ItemStatus;
  votes: ItemVote[];
  changes: {
    status: Array<{
      timestamp: Date;
      newValue: ItemStatus;
    }>;
  };
  // Embed createdBy User document
  user?: User;
}

export interface User {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  role?: 'admin';
}

export type SessionUser = Pick<User, 'username' | 'id' | 'role'>;

export interface FormItem extends Pick<Item, 'title' | 'description'> {
  category: ItemCategory | '';
  status: ItemStatus | '';
}

export const formItemSchema: yup.ObjectSchema<FormItem> = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
    category: yup.string().defined().oneOf(Object.values(ItemCategory)),
    status: yup
      .string()
      .defined()
      .oneOf(Object.values(ItemStatus))
      .default(ItemStatus.Pending),
  })
  .required();

export interface ItemQueryFilters {
  [key: string]: ItemCategory | string | ItemStatus | undefined;
  category?: ItemCategory;
  userId?: string;
  status?: ItemStatus;
  sort?: 'votes' | '-votes' | 'createdAt' | '-createdAt';
}
