import { type RefObject, useRef, useState } from "react";
import CalendarIcon from "../assets/calendar.svg?react";
import InputWrapper from "./InputWrapper";

type DateRangeFieldProps = {
  label: string;
  startId: string;
  endId: string;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
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

function DateRangeField({
  label,
  startId,
  endId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFieldProps) {
  const [internalStartDate, setInternalStartDate] = useState("");
  const [internalEndDate, setInternalEndDate] = useState("");
  const startDateInputRef = useRef<DateInputElement>(null);
  const endDateInputRef = useRef<DateInputElement>(null);
  const currentStartDate = startDate ?? internalStartDate;
  const currentEndDate = endDate ?? internalEndDate;

  const handleStartDateChange = (value: string) => {
    if (onStartDateChange) {
      onStartDateChange(value);
      return;
    }

    setInternalStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    if (onEndDateChange) {
      onEndDateChange(value);
      return;
    }

    setInternalEndDate(value);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
      <label
        htmlFor={startId}
        className="font-pretendard tracking-brand text-fg-secondary text-[16px] font-medium"
      >
        {label}
      </label>

      <div className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:items-center">
        <div className="flex w-full items-center gap-2 lg:w-auto">
          <InputWrapper.Input
            id={startId}
            type="text"
            readOnly
            value={formatDateForDisplay(currentStartDate)}
            placeholder="yyyy.mm.dd"
          />

          <button
            type="button"
            aria-label="시작일 선택"
            onClick={() => openDatePicker(startDateInputRef)}
            className="text-icon-primary hover:text-icon-hover flex h-11 w-8 items-center justify-center transition"
          >
            <CalendarIcon className="h-5 w-5 fill-current" />
          </button>
          <input
            ref={startDateInputRef}
            type="date"
            value={currentStartDate}
            onChange={(event) => handleStartDateChange(event.target.value)}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <span className="font-pretendard text-ui-base text-fg-subtle lg:self-auto">
          ~
        </span>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <InputWrapper.Input
            id={endId}
            type="text"
            readOnly
            value={formatDateForDisplay(currentEndDate)}
            placeholder="yyyy.mm.dd"
          />

          <button
            type="button"
            aria-label="종료일 선택"
            onClick={() => openDatePicker(endDateInputRef)}
            className="text-icon-primary hover:text-icon-hover flex h-11 w-8 items-center justify-center transition"
          >
            <CalendarIcon className="h-5 w-5 fill-current" />
          </button>
          <input
            ref={endDateInputRef}
            type="date"
            value={currentEndDate}
            min={currentStartDate || undefined}
            onChange={(event) => handleEndDateChange(event.target.value)}
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
