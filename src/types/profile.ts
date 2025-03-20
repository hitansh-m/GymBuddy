export type ExerciseType = 
  | "weightLifting"
  | "bodybuilding"
  | "powerlifting"
  | "powerbuilding"
  | "crossfit"
  | "hiit"
  | "circuitTraining"
  | "athleticTraining"
  | "functional"
  | "calisthenics"
  | "strengthTraining"
  | "plyometrics"
  | "endurance";

export type SportActivity = 
  | "basketball"
  | "volleyball"
  | "racquetball"
  | "squash"
  | "tennis"
  | "badminton"
  | "tableTennis"
  | "pickleball"
  | "indoorSoccer";

export type WeekDay = 
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ProfileFormData {
  name: string;
  age: number;
  role: "undergraduate" | "graduate" | "faculty" | "staff";
  level: string;
  goals: string;
  availability: string;
  bio: string;
  preferredGym: string;
  workoutDuration: string;
  exerciseTypes: ExerciseType[];
  sportsActivities: SportActivity[];
  availableDays: WeekDay[];
  preferredTimes: string[];
}