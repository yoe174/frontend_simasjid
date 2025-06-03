// components/FormElements/TimePicker/TimePickerAntd.tsx
"use client";

import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface TimePickerAntdProps {
  label?: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const TimePickerAntd: React.FC<TimePickerAntdProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  const handleChange = (time: Dayjs | null) => {
    onChange(name, time ? time.format("HH:mm") : "");
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <TimePicker
        value={value ? dayjs(value, "HH:mm") : null}
        onChange={handleChange}
        format="HH:mm"
        className="!w-full"
      />
    </div>
  );
};

export default TimePickerAntd;
