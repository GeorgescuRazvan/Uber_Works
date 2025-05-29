
import { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "task_1",
    userId: "user_123",
    type: "volunteer",
    title: "Help move furniture",
    description: "Need help moving a couch from 2nd floor apartment. Should take about 30 minutes with 2 people.",
    location: {
      lat: 52.3676,
      lng: 4.9041,
      address: "Dam Square, Amsterdam"
    },
    status: "open",
    mediaUrls: [],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "task_2",
    userId: "user_456",
    type: "paid",
    title: "Grocery shopping",
    description: "Need someone to pick up groceries from Albert Heijn. List provided, should take 1 hour max.",
    location: {
      lat: 52.3702,
      lng: 4.8952,
      address: "Vondelpark, Amsterdam"
    },
    price: 25,
    status: "open",
    mediaUrls: [],
    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z"
  },
  {
    id: "task_3",
    userId: "user_789",
    type: "volunteer",
    title: "Dog walking",
    description: "My dog Max needs a walk while I'm at work. He's friendly and well-trained. Walk should be about 30 minutes.",
    location: {
      lat: 52.3740,
      lng: 4.8896,
      address: "Museumplein, Amsterdam"
    },
    status: "accepted",
    helperId: "user_101",
    mediaUrls: [],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T14:00:00Z"
  }
];
