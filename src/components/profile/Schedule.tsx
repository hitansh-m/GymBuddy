import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData, WeekDay } from "@/types/profile";

const weekDays: { id: WeekDay; label: string }[] = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const timeSlots = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6; // Start from 6 AM
  return {
    id: `${hour.toString().padStart(2, "0")}:00`,
    label: `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`,
  };
});

interface ScheduleProps {
  form: UseFormReturn<ProfileFormData>;
}

export function Schedule({ form }: ScheduleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Available Days</h3>
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
          {weekDays.map((day) => (
            <FormField
              key={day.id}
              control={form.control}
              name="availableDays"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(day.id)}
                      onCheckedChange={(checked) => {
                        const value = field.value || [];
                        return checked
                          ? field.onChange([...value, day.id])
                          : field.onChange(value.filter((val) => val !== day.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{day.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Preferred Times</h3>
        <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-6">
          {timeSlots.map((time) => (
            <FormField
              key={time.id}
              control={form.control}
              name="preferredTimes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(time.id)}
                      onCheckedChange={(checked) => {
                        const value = field.value || [];
                        return checked
                          ? field.onChange([...value, time.id])
                          : field.onChange(value.filter((val) => val !== time.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{time.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}