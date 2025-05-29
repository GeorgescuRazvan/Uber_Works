import { useEffect, useRef } from "react";
import { Task } from "@/types/task";
import { googleMapsApiKey } from "@/config/cloud-services";

// Add this for TypeScript to recognize google.maps
declare global {
  interface Window {
    google: any;
  }
}

interface MapContainerProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  loading?: boolean;
  error?: string | null;
}

const MapContainer = ({ tasks, onTaskSelect, loading, error }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.google) {
      // Dynamically load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current && !mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: tasks[0]?.location.lat || 44.4268, lng: tasks[0]?.location.lng || 26.1025 },
            zoom: 13,
          });
        }
      };
      document.body.appendChild(script);
      return;
    }
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: tasks[0]?.location.lat || 44.4268, lng: tasks[0]?.location.lng || 26.1025 },
        zoom: 13,
      });
    }
  }, [tasks]);

  useEffect(() => {
    if (!mapInstance.current || !window.google) return;
    // Remove old markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    // Add new markers
    tasks.forEach(task => {
      const marker = new window.google.maps.Marker({
        position: { lat: task.location.lat, lng: task.location.lng },
        map: mapInstance.current,
        title: task.title,
        icon: task.type === 'paid' ? undefined : undefined // Customize if needed
      });
      marker.addListener('click', () => onTaskSelect(task.id));
      markers.current.push(marker);
    });
  }, [tasks, onTaskSelect]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div>Loading map...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 400 }} />
    </div>
  );
};

export default MapContainer;
