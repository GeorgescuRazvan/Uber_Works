import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/config/cloud-services';

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

class ChatService {
  private messagesCollection = collection(db, 'messages');

  async sendMessage(taskId: string, senderId: string, content: string): Promise<string> {
    const messageData = {
      taskId,
      senderId,
      content,
      timestamp: Timestamp.now()
    };

    const docRef = await addDoc(this.messagesCollection, messageData);
    return docRef.id;
  }

  subscribeToTaskMessages(taskId: string, callback: (messages: Message[]) => void) {
    const q = query(
      this.messagesCollection,
      where('taskId', '==', taskId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => this.convertMessage(doc.id, doc.data()));
      callback(messages);
    });
  }

  private convertMessage(id: string, data: DocumentData): Message {
    return {
      id,
      taskId: data.taskId,
      senderId: data.senderId,
      content: data.content,
      timestamp: data.timestamp.toDate().toISOString()
    };
  }
}

export const chatService = new ChatService(); 