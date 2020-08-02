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

export default interface Item {
  _id: ObjectId;
  title: string;
  description: string;
  created: Date;
  updated: Date;
  category: ItemCategory;
  createdBy: ObjectId;
  status: 'open' | 'accepted' | 'declined' | 'completed';
  votes: ItemVote[];
}
