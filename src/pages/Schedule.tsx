import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const { data: workouts } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workouts").select("*");
      if (error) throw error;
      return data;
    },
  });

  const scheduleWorkout = useMutation({
    mutationFn: async ({
      date,
      timeSlot,
      workoutType,
    }: {
      date: Date;
      timeSlot: string;
      workoutType: string;
    }) => {
      if (!currentUser) throw new Error("No user found");
      const { error } = await supabase.from("schedules").insert({
        date: date.toISOString().split("T")[0],
        time_slot: timeSlot,
        workout_type: workoutType,
        user_id: currentUser
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Success",
        description: "Workout scheduled successfully!",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const timeSlots = [
    "6:00 AM - 8:00 AM",
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
    "8:00 PM - 10:00 PM",
  ];

  const handleTimeSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Schedule</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleTimeSlotClick(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Workout</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {workouts?.map((workout) => (
              <Button
                key={workout.id}
                variant="outline"
                onClick={() => {
                  if (date && selectedSlot) {
                    scheduleWorkout.mutate({
                      date,
                      timeSlot: selectedSlot,
                      workoutType: workout.title,
                    });
                  }
                }}
              >
                {workout.title}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;