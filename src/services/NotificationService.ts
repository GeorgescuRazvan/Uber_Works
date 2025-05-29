import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/config/cloud-services';
import { cloudFunctions } from '@/config/cloud-services';

class NotificationService {
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await this.getToken();
        return token;
      }
      throw new Error('Notification permission denied');
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  async getToken() {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      return currentToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      throw error;
    }
  }

  onMessageListener() {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  }

  async subscribeToTopic(token: string, topic: string) {
    const response = await fetch(cloudFunctions.subscribeToTopic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to topic');
    }
  }

  async unsubscribeFromTopic(token: string, topic: string) {
    const response = await fetch(cloudFunctions.unsubscribeFromTopic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error('Failed to unsubscribe from topic');
    }
  }
}

export const notificationService = new NotificationService(); 