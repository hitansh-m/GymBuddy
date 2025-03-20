import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MatchCard = ({ match, onConnect }: any) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">{match.username}</CardTitle>
      <span className="text-primary font-bold">{match.compatibility}% Match</span>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center space-x-2">
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{match.level || 'New User'}</span>
      </div>
      <p className="text-sm text-muted-foreground">{match.goals || 'No goals set yet'}</p>
      <Button 
        className="w-full" 
        onClick={() => onConnect(match)}
        disabled={!match.id || match.isMock} // Disable for mock users
      >
        {match.isMock ? 'Demo User' : 'Connect'}
      </Button>
    </CardContent>
  </Card>
);

const ChatDialog = ({ match, isOpen, onClose }: any) => {
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const { data: messages } = useQuery({
    queryKey: ["chats", match?.id],
    queryFn: async () => {
      if (!match?.id) return [];
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(`sender_id.eq.${match.id},receiver_id.eq.${match.id}`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!match?.id && !match?.isMock,
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!currentUser || !match?.id || match.isMock) {
        throw new Error("Cannot send message to demo user");
      }
      const { error } = await supabase.from("chats").insert({
        message,
        receiver_id: match.id,
        sender_id: currentUser
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["chats", match?.id] });
      toast({
        title: "Success",
        description: "Message sent successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chat with {match?.username}</DialogTitle>
          <DialogDescription>
            Start a conversation with your workout partner
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg">
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.sender_id === match.id
                    ? "bg-muted ml-auto"
                    : "bg-primary text-primary-foreground"
                } max-w-[80%]`}
              >
                {msg.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={match?.isMock}
            />
            <Button type="submit" disabled={match?.isMock}>Send</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Matches = () => {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch real users from profiles
  const { data: realUsers = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      if (!currentUser) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq('id', currentUser); // Exclude current user
      
      if (error) throw error;
      
      // Transform profiles to match format
      return data.map((profile) => ({
        id: profile.id,
        username: profile.username || 'Anonymous User',
        level: 'New User',
        goals: 'No goals set yet',
        compatibility: Math.floor(Math.random() * 30) + 70, // Random compatibility between 70-100%
      }));
    },
    enabled: !!currentUser,
  });

  // Mock data for demonstration
  const mockMatches = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      username: "Alex Johnson",
      level: "Intermediate",
      goals: "Strength Training, Muscle Gain",
      compatibility: 95,
      isMock: true,
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174001",
      username: "Sarah Smith",
      level: "Advanced",
      goals: "Powerlifting, Competition Prep",
      compatibility: 88,
      isMock: true,
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174002",
      username: "Mike Chen",
      level: "Beginner",
      goals: "General Fitness, Weight Loss",
      compatibility: 82,
      isMock: true,
    },
  ];

  // Combine real and mock matches
  const allMatches = [...realUsers, ...mockMatches];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Your Matches</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allMatches.map((match) => (
          <MatchCard key={match.id} match={match} onConnect={setSelectedMatch} />
        ))}
      </div>
      <ChatDialog
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};

export default Matches;