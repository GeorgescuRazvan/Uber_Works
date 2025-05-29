import { cloudFunctions } from '@/config/cloud-services';
import type { Task } from './TaskService';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

class GeoService {
  async findNearbyTasks(lat: number, lng: number, radiusInKm: number): Promise<Task[]> {
    const response = await fetch(
      `${cloudFunctions.nearbyTasks}?lat=${lat}&lng=${lng}&radius=${radiusInKm}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to find nearby tasks');
    }

    return response.json();
  }

  async findTasksInBounds(
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number
  ): Promise<Task[]> {
    const response = await fetch(
      `${cloudFunctions.tasksInBounds}?` +
      `swLat=${swLat}&swLng=${swLng}&neLat=${neLat}&neLng=${neLng}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to find tasks in bounds');
    }

    return response.json();
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula for calculating great-circle distance
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const geoService = new GeoService(); 