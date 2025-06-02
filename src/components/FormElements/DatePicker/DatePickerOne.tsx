// "use client";

// import { Calendar } from "@/components/Layouts/sidebar/icons";
// import flatpickr from "flatpickr";
// import { useEffect } from "react";

// const DatePickerOne = () => {
//   useEffect(() => {
//     // Init flatpickr
//     flatpickr(".form-datepicker", {
//       mode: "single",
//       static: true,
//       monthSelectorType: "static",
//       dateFormat: "M j, Y",
//     });
//   }, []);

//   return (
//     <div>
//       <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
//         Date picker
//       </label>
//       <div className="relative">
//         <input
//           className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
//           placeholder="mm/dd/yyyy"
//           data-class="flatpickr-right"
//         />

//         <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
//           <Calendar className="size-5 text-[#9CA3AF]" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DatePickerOne;

// components/FormElements/DatePicker/DatePickerOne.tsx
"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

interface DatePickerOneProps {
  label?: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const DatePickerOne = ({ label, name, value, onChange }: DatePickerOneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickr(inputRef.current, {
      defaultDate: value || undefined,
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const formatted = selectedDates[0].toISOString().split("T")[0];
          onChange(name, formatted);
        }
      },
    });
  }, [value]);

  return (
    <div>
      {label && (
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          defaultValue={value}
          className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="yyyy-mm-dd"
          data-class="flatpickr-right"
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
