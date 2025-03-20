import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData, ExerciseType, SportActivity } from "@/types/profile";

const exerciseTypes: { id: ExerciseType; label: string }[] = [
  { id: "weightLifting", label: "Weight Lifting" },
  { id: "bodybuilding", label: "Bodybuilding" },
  { id: "powerlifting", label: "Powerlifting" },
  { id: "powerbuilding", label: "Powerbuilding" },
  { id: "crossfit", label: "CrossFit" },
  { id: "hiit", label: "HIIT" },
  { id: "circuitTraining", label: "Circuit Training" },
  { id: "athleticTraining", label: "Athletic Training" },
  { id: "functional", label: "Functional" },
  { id: "calisthenics", label: "Calisthenics" },
  { id: "strengthTraining", label: "Strength Training" },
  { id: "plyometrics", label: "Plyometrics" },
  { id: "endurance", label: "Endurance" },
];

const sportsActivities: { id: SportActivity; label: string }[] = [
  { id: "basketball", label: "Basketball" },
  { id: "volleyball", label: "Volleyball" },
  { id: "racquetball", label: "Racquetball" },
  { id: "squash", label: "Squash" },
  { id: "tennis", label: "Tennis" },
  { id: "badminton", label: "Badminton" },
  { id: "tableTennis", label: "Table Tennis" },
  { id: "pickleball", label: "Pickleball" },
  { id: "indoorSoccer", label: "Indoor Soccer" },
];

interface ExercisePreferencesProps {
  form: UseFormReturn<ProfileFormData>;
}

export function ExercisePreferences({ form }: ExercisePreferencesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Exercise Types</h3>
        <p className="text-sm text-muted-foreground">
          Select all the exercise types you're interested in
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
          {exerciseTypes.map((type) => (
            <FormField
              key={type.id}
              control={form.control}
              name="exerciseTypes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(type.id)}
                      onCheckedChange={(checked) => {
                        const value = field.value || [];
                        return checked
                          ? field.onChange([...value, type.id])
                          : field.onChange(value.filter((val) => val !== type.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{type.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Sports Activities</h3>
        <p className="text-sm text-muted-foreground">
          Select any sports you're interested in playing
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
          {sportsActivities.map((sport) => (
            <FormField
              key={sport.id}
              control={form.control}
              name="sportsActivities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(sport.id)}
                      onCheckedChange={(checked) => {
                        const value = field.value || [];
                        return checked
                          ? field.onChange([...value, sport.id])
                          : field.onChange(value.filter((val) => val !== sport.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{sport.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}