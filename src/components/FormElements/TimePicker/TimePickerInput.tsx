// src\components\FormElements\TimePicker\TimePickerInput.tsx
"use client";

import React from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface TimePickerInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <TimePicker
        onChange={(val) => onChange(name, val as string)}
        value={value}
        disableClock
        format="HH:mm"
        className="w-full rounded-md border border-stroke px-3 py-2 text-sm dark:bg-dark-2 dark:text-white dark:border-dark-3"
        clearIcon={null}
        clockIcon={null}
      />
    </div>
  );
};

export default TimePickerInput;
