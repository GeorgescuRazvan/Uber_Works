
export interface Task {
  id: string;
  userId: string;
  type: 'volunteer' | 'paid';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price?: number;
  status: 'open' | 'accepted' | 'completed';
  helperId?: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskRating {
  id: string;
  taskId: string;
  raterId: string;
  rateeId: string;
  stars: number;
  comment?: string;
  createdAt: string;
}
