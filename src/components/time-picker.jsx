import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

/**
 * Generates array of time slots in 15-minute increments
 * @returns {string[]} Array of time strings in 24-hour format
 */
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

/**
 * A time picker component that allows selecting time in 15-minute increments
 * @param {Object} props
 * @param {string} [props.initialTime] - Initial time in 24-hour format (HH:mm)
 * @param {(time: string) => void} props.onTimeChange - Callback when time changes
 * @param {string} [props.minTime] - Minimum selectable time in 24-hour format
 * @param {string} [props.maxTime] - Maximum selectable time in 24-hour format
 * @param {string} props.value - Current time value
 */
const TimePicker = ({
  onTimeChange,
  minTime = "00:00",
  maxTime = "23:45",
  value
}) => {
  const timeSlots = generateTimeSlots();
  const filteredTimeSlots = timeSlots.filter(
    time => time >= minTime && time <= maxTime
  );

  return (
    <Select
      value={value}
      onValueChange={onTimeChange}
    >
      <SelectTrigger className="w-full">
        <Clock className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        {filteredTimeSlots.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePicker;