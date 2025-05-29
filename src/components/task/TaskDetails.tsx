
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Euro, Heart, User } from "lucide-react";
import { mockTasks } from "@/data/mockData";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const task = mockTasks.find(t => t.id === id);
  
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h2>
          <Button onClick={() => navigate("/")}>Back to Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mr-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Task Details</h1>
      </div>
      
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <Badge variant={task.type === 'paid' ? 'default' : 'secondary'}>
                {task.type === 'paid' ? (
                  <><Euro className="w-3 h-3 mr-1" />Paid</>
                ) : (
                  <><Heart className="w-3 h-3 mr-1" />Volunteer</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{task.description}</p>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {task.location.address}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Posted {new Date(task.createdAt).toLocaleDateString()}
            </div>
            
            {task.price && (
              <div className="text-2xl font-bold text-green-600">
                €{task.price}
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              Posted by TaskHub User
            </div>
          </CardContent>
        </Card>
        
        {task.status === 'open' && (
          <div className="flex space-x-2">
            <Button className="flex-1" size="lg">
              {task.type === 'paid' ? 'Accept Task' : 'Offer Help'}
            </Button>
            <Button variant="outline" size="lg">
              Message
            </Button>
          </div>
        )}
        
        {task.status === 'accepted' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-yellow-800 font-medium">
                This task has been accepted by another helper.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
