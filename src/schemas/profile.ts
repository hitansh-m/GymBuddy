import * as z from "zod";
import { ExerciseType, SportActivity, WeekDay } from "@/types/profile";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(16).max(100),
  role: z.enum(["undergraduate", "graduate", "faculty", "staff"]),
  level: z.string({
    required_error: "Please select your experience level.",
  }),
  goals: z.string({
    required_error: "Please select your primary fitness goal.",
  }),
  availability: z.string().min(1, {
    message: "Please specify your availability.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
  preferredGym: z.string({
    required_error: "Please select your preferred Rutgers gym.",
  }),
  workoutDuration: z.string({
    required_error: "Please select your preferred workout duration.",
  }),
  exerciseTypes: z.array(z.string()).min(1, {
    message: "Please select at least one exercise type.",
  }),
  sportsActivities: z.array(z.string()),
  availableDays: z.array(z.string()).min(1, {
    message: "Please select at least one available day.",
  }),
  preferredTimes: z.array(z.string()).min(1, {
    message: "Please select at least one preferred time.",
  }),
});