import { type RefObject, useRef, useState } from "react";
import CalendarIcon from "../assets/calendar.svg?react";
import InputWrapper from "./InputWrapper";

type DateRangeFieldProps = {
  label: string;
  startId: string;
  endId: string;
};

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void;
};

function formatDateForDisplay(value: string) {
  if (!value) {
    return "";
  }

  return value.replace(/-/g, ".");
}

function openDatePicker(inputRef: RefObject<DateInputElement | null>) {
  const input = inputRef.current;

  if (!input) {
    return;
  }

  if (typeof input.showPicker === "function") {
    input.showPicker();
    return;
  }

  input.click();
}

function DateRangeField({ label, startId, endId }: DateRangeFieldProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateInputRef = useRef<DateInputElement>(null);
  const endDateInputRef = useRef<DateInputElement>(null);

  return (
    <div className="flex items-center gap-5">
      <label
        htmlFor={startId}
        className="font-pretendard tracking-brand min-w-14 text-sm font-medium text-[#f1f1f1]"
      >
        {label}
      </label>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <InputWrapper.Input
            id={startId}
            type="text"
            readOnly
            value={formatDateForDisplay(startDate)}
            placeholder="yyyy.mm.dd"
            className="w-38 cursor-default"
          />
          <button
            type="button"
            aria-label="시작일 선택"
            onClick={() => openDatePicker(startDateInputRef)}
            className="flex h-11 w-8 items-center justify-center text-[#9AA5B5] transition hover:text-[#c0c9d5]"
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
          <input
            ref={startDateInputRef}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <span className="font-pretendard text-base text-[#d5d5d5]">~</span>

        <div className="flex items-center gap-2">
          <InputWrapper.Input
            id={endId}
            type="text"
            readOnly
            value={formatDateForDisplay(endDate)}
            placeholder="yyyy.mm.dd"
            className="w-38 cursor-default"
          />
          <button
            type="button"
            aria-label="종료일 선택"
            onClick={() => openDatePicker(endDateInputRef)}
            className="flex h-11 w-8 items-center justify-center text-[#9AA5B5] transition hover:text-[#c0c9d5]"
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
          <input
            ref={endDateInputRef}
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default DateRangeField;
