
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold">Profile</h1>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {user.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.displayName}</h2>
            <p className="text-gray-600">{user.email}</p>
            
            <div className="flex items-center justify-center mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="mx-1 font-medium">{user.reputation}</span>
              <span className="text-gray-600">/ 5.0</span>
            </div>
            
            <div className="mt-4 flex space-x-2 justify-center">
              <Button variant="outline" size="sm">Edit Profile</Button>
              <Button variant="outline" size="sm">Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className="mx-auto mb-2 bg-blue-500">
                <MapPin className="w-4 h-4" />
              </Badge>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-600">Tasks Posted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className="mx-auto mb-2 bg-green-500">
                <Award className="w-4 h-4" />
              </Badge>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-600">Tasks Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className="mx-auto mb-2 bg-purple-500">
                <Calendar className="w-4 h-4" />
              </Badge>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-gray-600">In Progress</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-1 h-full bg-blue-500 rounded"></div>
                <div>
                  <p className="font-medium">Completed dog walking task</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-1 h-full bg-green-500 rounded"></div>
                <div>
                  <p className="font-medium">Received 5-star rating</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-1 h-full bg-purple-500 rounded"></div>
                <div>
                  <p className="font-medium">Posted task: Help with groceries</p>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
