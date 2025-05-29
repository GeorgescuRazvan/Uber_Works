import { cloudFunctions } from '@/config/cloud-services';

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  tasksByType: {
    volunteer: number;
    paid: number;
  };
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  averageReputation: number;
  tasksPerUser: number;
}

class AnalyticsService {
  async getTaskAnalytics(startDate?: Date, endDate?: Date): Promise<TaskAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const response = await fetch(
      `${cloudFunctions.getTaskAnalytics}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch task analytics');
    }

    return response.json();
  }

  async getUserAnalytics(startDate?: Date, endDate?: Date): Promise<UserAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const response = await fetch(
      `${cloudFunctions.getUserAnalytics}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user analytics');
    }

    return response.json();
  }

  async logEvent(eventName: string, eventData: Record<string, any>) {
    const response = await fetch(cloudFunctions.logAnalyticsEvent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventData,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to log analytics event');
    }
  }
}

export const analyticsService = new AnalyticsService(); 