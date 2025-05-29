
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, HelpCircle, MessageSquare, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Support = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending support request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Support request sent",
      description: "We'll get back to you soon.",
    });
    
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold">Support</h1>
      </div>
      
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              How can we help you?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's your question about?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue or question"
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Support Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">How does task payment work?</h4>
              <p className="text-sm text-gray-600">
                Payments are processed securely through our platform. Funds are held in escrow 
                until the task is completed to the satisfaction of both parties.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">How is my safety ensured?</h4>
              <p className="text-sm text-gray-600">
                All users undergo identity verification. We also provide ratings and reviews 
                for transparency. For further security, our platform tracks task locations.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">What if a task isn't completed properly?</h4>
              <p className="text-sm text-gray-600">
                If there's an issue with task completion, contact support immediately. 
                We have a dispute resolution process to ensure fairness for both parties.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold mb-1">Contact Information</h3>
              <p className="text-sm text-gray-600">Email: support@taskhub.com</p>
              <p className="text-sm text-gray-600">Hours: Monday-Friday, 9am-5pm</p>
              <p className="text-sm text-gray-600">Response time: Within 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
