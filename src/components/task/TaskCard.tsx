
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Euro, Heart } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
}

const TaskCard = ({ task, isSelected, onClick }: TaskCardProps) => {
  const timeAgo = new Date(task.createdAt).toLocaleTimeString();

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 line-clamp-1">{task.title}</h4>
          <Badge variant={task.type === 'paid' ? 'default' : 'secondary'}>
            {task.type === 'paid' ? (
              <><Euro className="w-3 h-3 mr-1" />Paid</>
            ) : (
              <><Heart className="w-3 h-3 mr-1" />Volunteer</>
            )}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{task.location.address}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        {task.price && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">€{task.price}</span>
            <Button size="sm" variant="outline">
              Accept Task
            </Button>
          </div>
        )}
        
        {task.type === 'volunteer' && (
          <div className="mt-2">
            <Button size="sm" variant="outline" className="w-full">
              Help Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
