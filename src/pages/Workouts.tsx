import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const WorkoutCard = ({ workout, onViewDetails }: any) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Dumbbell className="h-5 w-5 text-primary" />
        <span>{workout.title}</span>
      </CardTitle>
      <CardDescription>{workout.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Level:</span>
          <span>{workout.level}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration:</span>
          <span>{workout.duration}</span>
        </div>
        <Button className="w-full mt-4" onClick={() => onViewDetails(workout)}>
          View Details
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Workouts = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const { data: workouts } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workouts").select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Workout Programs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {workouts?.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onViewDetails={setSelectedWorkout}
          />
        ))}
      </div>

      <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedWorkout?.detailed_description}</p>
            <div className="space-y-2">
              <h3 className="font-medium">Exercises</h3>
              <div className="space-y-2">
                {selectedWorkout?.exercises.map((exercise: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
                  >
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                      <span className="mx-2">•</span>
                      {exercise.rest} rest
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workouts;