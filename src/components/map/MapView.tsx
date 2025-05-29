import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskModal from "@/components/task/CreateTaskModal";
import MapContainer from "./MapContainer";
import { geoService } from "@/services/GeoService";
import { Task } from "@/types/task";

const MapView = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);
          setError(null);
          const { latitude, longitude } = position.coords;
          const fetchedTasks = await geoService.findNearbyTasks(latitude, longitude, 10); // 10km radius
          setTasks(fetchedTasks);
        } catch (err) {
          setError("Failed to fetch tasks");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">TaskHub</h1>
          <p className="text-sm text-gray-600">Find help nearby</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowCreateTask(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer tasks={tasks} onTaskSelect={setSelectedTask} loading={loading} error={error} />
        
        {/* Bottom Sheet with Tasks */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Nearby Tasks</h3>
            <div className="space-y-3">
              {loading ? (
                <div>Loading tasks...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : tasks.length === 0 ? (
                <div>No tasks found nearby.</div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTask === task.id}
                    onClick={() => setSelectedTask(task.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal 
        open={showCreateTask} 
        onClose={() => setShowCreateTask(false)} 
      />
    </div>
  );
};

export default MapView;
