import { collection, addDoc, getDocs, doc, updateDoc, query, where, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/cloud-services';

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

class TaskService {
  private tasksCollection = collection(db, 'tasks');

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const taskData = {
      ...task,
      createdAt: now,
      updatedAt: now,
      location: new GeoPoint(task.location.lat, task.location.lng)
    };

    const docRef = await addDoc(this.tasksCollection, taskData);
    return docRef.id;
  }

  async uploadTaskMedia(taskId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async getNearbyTasks(lat: number, lng: number, radiusInKm: number) {
    // Note: This is a simplified version. In production, you would use
    // Cloud Functions with Geohashing or PostGIS for proper geospatial queries
    const querySnapshot = await getDocs(this.tasksCollection);
    const tasks: Task[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const taskLat = data.location.latitude;
      const taskLng = data.location.longitude;
      
      // Simple distance calculation (not accurate for large distances)
      const distance = Math.sqrt(
        Math.pow(taskLat - lat, 2) + Math.pow(taskLng - lng, 2)
      ) * 111; // Rough conversion to kilometers

      if (distance <= radiusInKm) {
        tasks.push({
          id: doc.id,
          ...data,
          location: {
            lat: taskLat,
            lng: taskLng,
            address: data.location.address
          }
        } as Task);
      }
    });

    return tasks;
  }

  async updateTaskStatus(taskId: string, status: Task['status'], helperId?: string) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status,
      helperId,
      updatedAt: new Date().toISOString()
    });
  }

  async getTasksByUser(userId: string) {
    const q = query(this.tasksCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  }
}

export const taskService = new TaskService(); 