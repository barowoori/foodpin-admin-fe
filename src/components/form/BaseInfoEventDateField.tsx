import { useEffect, useMemo, useRef, useState } from "react";
import CalendarIcon from "../../assets/calendar.svg?react";
import type { EventDateMode, EventDateTime } from "../../types";
import {
  formatIsoDate,
  formatIsoDateCompact,
  getIsoDateRange,
  parseIsoDate,
} from "../../utils";
import FormInput from "./FormInput";

type BaseInfoEventDateFieldProps = {
  mode: EventDateMode;
  selectedDates: string[];
  periodStartDate: string;
  periodEndDate: string;
  periodTimeByDate: Record<string, EventDateTime>;
  applyTimeToAll: boolean;
  onModeChange: (mode: EventDateMode) => void;
  onSelectedDatesChange: (next: string[]) => void;
  onPeriodStartDateChange: (value: string) => void;
  onPeriodEndDateChange: (value: string) => void;
  onPeriodTimeChange: (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => void;
  onApplyTimeToAllChange: (value: boolean) => void;
};

type CalendarMode = "MULTI" | "RANGE";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function padTwoDigits(value: number) {
  return String(value).padStart(2, "0");
}

const TIME_STEP_MINUTES = 1;
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTE_OPTIONS = Array.from(
  { length: 60 / TIME_STEP_MINUTES },
  (_, index) => index * TIME_STEP_MINUTES,
);

function toMinutes(time: string) {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

type TimePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
};

function TimePickerField({ value, onChange, minTime }: TimePickerFieldProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"HOUR" | "MINUTE">("HOUR");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const minMinutes = useMemo(() => toMinutes(minTime ?? ""), [minTime]);

  const closePicker = () => {
    setIsOpen(false);
    setStep("HOUR");
    setSelectedHour(null);
  };

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !pickerRef.current) {
        return;
      }

      if (!pickerRef.current.contains(target)) {
        setIsOpen(false);
        setStep("HOUR");
        setSelectedHour(null);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, []);

  const isHourDisabled = (hour: number) => {
    if (minMinutes === null) {
      return false;
    }

    const latestMinuteInHour = hour * 60 + 59;
    return latestMinuteInHour < minMinutes;
  };

  const isMinuteDisabled = (minute: number) => {
    if (selectedHour === null || minMinutes === null) {
      return false;
    }

    return selectedHour * 60 + minute < minMinutes;
  };

  return (
    <div ref={pickerRef} className="relative w-34">
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            closePicker();
            return;
          }

          setStep("HOUR");
          setSelectedHour(null);
          setIsOpen(true);
        }}
        className="font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 w-full rounded-lg border px-3 text-left transition outline-none focus:ring-2"
      >
        {value || "HH:mm"}
        <span className="text-fg-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px]">
          v
        </span>
      </button>
      {isOpen ? (
        <div className="border-border-control bg-bg-app absolute top-12 left-0 z-40 w-60 rounded-lg border p-2 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-fg-subtle text-[12px] font-medium">
              {step === "HOUR" ? "Hour" : "Minute"}
            </span>
            {step === "MINUTE" ? (
              <button
                type="button"
                onClick={() => setStep("HOUR")}
                className="text-fg-muted hover:text-fg-secondary text-[12px]"
              >
                Back
              </button>
            ) : null}
          </div>

          {step === "HOUR" ? (
            <div className="grid grid-cols-4 gap-1 overflow-y-auto pr-1">
              {HOUR_OPTIONS.map((hour) => {
                const isDisabled = isHourDisabled(hour);

                return (
                  <button
                    key={hour}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedHour(hour);
                      setStep("MINUTE");
                    }}
                    className={`h-8 rounded-md text-[13px] transition ${
                      isDisabled
                        ? "text-fg-muted/45 cursor-not-allowed"
                        : "text-fg-subtle hover:bg-bg-control"
                    }`.trim()}
                  >
                    {padTwoDigits(hour)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid max-h-53 grid-cols-4 gap-1 overflow-y-auto pr-1">
              {MINUTE_OPTIONS.map((minute) => {
                const minuteLabel = padTwoDigits(minute);
                const isDisabled = isMinuteDisabled(minute);
                const nextValue =
                  selectedHour === null
                    ? ""
                    : `${padTwoDigits(selectedHour)}:${minuteLabel}`;

                return (
                  <button
                    key={minute}
                    type="button"
                    disabled={isDisabled || selectedHour === null}
                    onClick={() => {
                      if (!nextValue) {
                        return;
                      }

                      onChange(nextValue);
                      closePicker();
                    }}
                    className={`h-8 rounded-md text-[13px] transition ${
                      isDisabled || selectedHour === null
                        ? "text-fg-muted/45 cursor-not-allowed"
                        : nextValue === value
                          ? "bg-focus-ring text-fg-primary"
                          : "text-fg-subtle hover:bg-bg-control"
                    }`.trim()}
                  >
                    {minuteLabel}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onChange("");
                closePicker();
              }}
              className="text-fg-muted hover:text-fg-secondary text-[12px]"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getInitialMonth(anchorDate: string) {
  const parsed = parseIsoDate(anchorDate);
  if (parsed) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
  }

  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function shiftMonth(month: Date, offset: number) {
  return new Date(month.getFullYear(), month.getMonth() + offset, 1);
}

function buildMonthCells(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDate; day += 1) {
    const date = new Date(year, month, day);
    cells.push(formatIsoDate(date));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function BaseInfoEventDateField({
  mode,
  selectedDates,
  periodStartDate,
  periodEndDate,
  periodTimeByDate,
  applyTimeToAll,
  onModeChange,
  onSelectedDatesChange,
  onPeriodStartDateChange,
  onPeriodEndDateChange,
  onPeriodTimeChange,
  onApplyTimeToAllChange,
}: BaseInfoEventDateFieldProps) {
  const dateCalendarAreaRef = useRef<HTMLDivElement>(null);
  const periodCalendarAreaRef = useRef<HTMLDivElement>(null);
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);
  const [periodCalendarOpen, setPeriodCalendarOpen] = useState(false);
  const [dateCalendarMonth, setDateCalendarMonth] = useState(() =>
    getInitialMonth(selectedDates[0] ?? ""),
  );
  const [periodCalendarMonth, setPeriodCalendarMonth] = useState(() =>
    getInitialMonth(periodStartDate || periodEndDate),
  );
  const todayIso = formatIsoDate(new Date());
  const selectedDateSet = useMemo(
    () => new Set(selectedDates),
    [selectedDates],
  );
  const periodDates = useMemo(
    () => getIsoDateRange(periodStartDate, periodEndDate),
    [periodStartDate, periodEndDate],
  );
  const activeDates = useMemo(
    () =>
      mode === "PERIOD"
        ? periodDates
        : selectedDates.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    [mode, periodDates, selectedDates],
  );
  const selectedDatesLabel = selectedDates
    .slice()
    .sort()
    .map((date) => formatIsoDateCompact(date))
    .join(", ");
  const periodLabel =
    periodStartDate && periodEndDate
      ? `${formatIsoDateCompact(periodStartDate)} ~ ${formatIsoDateCompact(periodEndDate)}`
      : "";

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (dateCalendarOpen && !dateCalendarAreaRef.current?.contains(target)) {
        setDateCalendarOpen(false);
      }

      if (
        periodCalendarOpen &&
        !periodCalendarAreaRef.current?.contains(target)
      ) {
        setPeriodCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, [dateCalendarOpen, periodCalendarOpen]);

  const renderCalendar = (
    calendarMode: CalendarMode,
    viewMonth: Date,
    onPrevMonth: () => void,
    onNextMonth: () => void,
    onClose: () => void,
  ) => {
    const cells = buildMonthCells(viewMonth);
    const monthTitle = `${viewMonth.getFullYear()}년 ${viewMonth.getMonth() + 1}월`;

    return (
      <div className="border-border-control bg-bg-app absolute top-13 left-0 z-30 w-70 rounded-lg border p-3 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="text-fg-secondary hover:bg-bg-control h-7 w-7 rounded-md text-sm"
          >
            {"<"}
          </button>
          <span className="text-fg-primary text-[14px] font-semibold">
            {monthTitle}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="text-fg-secondary hover:bg-bg-control h-7 w-7 rounded-md text-sm"
          >
            {">"}
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[12px] text-[#9a9a9a]">
          {WEEKDAY_LABELS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="h-8 w-8" />;
            }

            const dayNumber = Number(date.slice(-2));
            const isToday = date === todayIso;
            const isSelectedMulti = selectedDateSet.has(date);
            const isRangeStart = date === periodStartDate;
            const isRangeEnd = date === periodEndDate;
            const isInRange =
              Boolean(periodStartDate && periodEndDate) &&
              date > periodStartDate &&
              date < periodEndDate;
            const isActive =
              calendarMode === "MULTI"
                ? isSelectedMulti
                : isRangeStart || isRangeEnd;

            return (
              <button
                key={date}
                type="button"
                onClick={() => {
                  if (calendarMode === "MULTI") {
                    const next = new Set(selectedDateSet);
                    if (next.has(date)) {
                      next.delete(date);
                    } else {
                      next.add(date);
                    }
                    onModeChange("DATE");
                    onSelectedDatesChange(Array.from(next).sort());
                    return;
                  }

                  if (!periodStartDate || (periodStartDate && periodEndDate)) {
                    onModeChange("PERIOD");
                    onPeriodStartDateChange(date);
                    onPeriodEndDateChange("");
                    return;
                  }

                  if (date < periodStartDate) {
                    onModeChange("PERIOD");
                    onPeriodStartDateChange(date);
                    onPeriodEndDateChange(periodStartDate);
                    onClose();
                    return;
                  }

                  onModeChange("PERIOD");
                  onPeriodEndDateChange(date);
                  onClose();
                }}
                className={`h-8 w-8 rounded-md text-[13px] transition ${
                  isActive
                    ? "bg-focus-ring text-fg-primary"
                    : isInRange
                      ? "bg-focus-ring/25 text-fg-primary"
                      : "text-fg-subtle hover:bg-bg-control"
                } ${isToday && !isActive ? "border-border-control border" : ""}`.trim()}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (calendarMode === "MULTI") {
                onSelectedDatesChange([]);
              } else {
                onPeriodStartDateChange("");
                onPeriodEndDateChange("");
              }
            }}
            className="text-fg-subtle hover:text-fg-secondary text-[12px]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-subtle hover:text-fg-secondary text-[12px]"
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[16px] font-medium">
          <input
            type="radio"
            name="event-date-mode"
            value="DATE"
            checked={mode === "DATE"}
            onChange={() => onModeChange("DATE")}
            className="border-border-control bg-bg-app accent-focus-ring h-4.5 w-4.5"
          />
          날짜별
        </label>

        <div ref={dateCalendarAreaRef} className="relative">
          <FormInput
            readOnly
            value={selectedDatesLabel}
            placeholder="yy/mm/dd, yy/mm/dd, ..."
            className="max-w-80 pr-10"
          />
          <button
            type="button"
            aria-label="날짜별 일정 선택"
            onClick={() => {
              setDateCalendarMonth(getInitialMonth(selectedDates[0] ?? ""));
              setDateCalendarOpen((prev) => !prev);
              setPeriodCalendarOpen(false);
            }}
            className="text-icon-primary hover:text-icon-hover absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <CalendarIcon className="h-4 w-4 fill-current" />
          </button>
          {dateCalendarOpen
            ? renderCalendar(
                "MULTI",
                dateCalendarMonth,
                () => setDateCalendarMonth((prev) => shiftMonth(prev, -1)),
                () => setDateCalendarMonth((prev) => shiftMonth(prev, 1)),
                () => setDateCalendarOpen(false),
              )
            : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[16px] font-medium">
          <input
            type="radio"
            name="event-date-mode"
            value="PERIOD"
            checked={mode === "PERIOD"}
            onChange={() => onModeChange("PERIOD")}
            className="border-border-control bg-bg-app accent-focus-ring h-4.5 w-4.5"
          />
          기간별
        </label>

        <div ref={periodCalendarAreaRef} className="relative">
          <FormInput
            readOnly
            value={periodLabel}
            placeholder="yy/mm/dd ~ yy/mm/dd"
            className="max-w-80 pr-10"
          />
          <button
            type="button"
            aria-label="기간 선택"
            onClick={() => {
              setPeriodCalendarMonth(
                getInitialMonth(periodStartDate || periodEndDate),
              );
              setPeriodCalendarOpen((prev) => !prev);
              setDateCalendarOpen(false);
            }}
            className="text-icon-primary hover:text-icon-hover absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <CalendarIcon className="h-4 w-4 fill-current" />
          </button>
          {periodCalendarOpen
            ? renderCalendar(
                "RANGE",
                periodCalendarMonth,
                () => setPeriodCalendarMonth((prev) => shiftMonth(prev, -1)),
                () => setPeriodCalendarMonth((prev) => shiftMonth(prev, 1)),
                () => setPeriodCalendarOpen(false),
              )
            : null}
        </div>
      </div>

      {activeDates.length > 0 ? (
        <div className="mt-1 flex flex-col gap-2 pl-2">
          {activeDates.map((date, index) => {
            const currentTime = periodTimeByDate[date] ?? {
              startTime: "",
              endTime: "",
            };
            const currentEndTimeMinutes = toMinutes(currentTime.endTime);

            return (
              <div key={date} className="flex items-center gap-2">
                <span className="text-fg-subtle w-18 text-[15px] font-medium">
                  {formatIsoDateCompact(date)}
                </span>
                <TimePickerField
                  value={currentTime.startTime}
                  onChange={(nextValue) => {
                    onPeriodTimeChange(date, "startTime", nextValue);

                    const nextStartTimeMinutes = toMinutes(nextValue);
                    if (
                      nextStartTimeMinutes !== null &&
                      currentEndTimeMinutes !== null &&
                      currentEndTimeMinutes < nextStartTimeMinutes
                    ) {
                      onPeriodTimeChange(date, "endTime", "");
                    }
                  }}
                />
                <span className="text-fg-subtle text-[15px]">~</span>
                <TimePickerField
                  value={currentTime.endTime}
                  minTime={currentTime.startTime}
                  onChange={(nextValue) =>
                    onPeriodTimeChange(date, "endTime", nextValue)
                  }
                />
                {index === 0 ? (
                  <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
                    <input
                      type="checkbox"
                      checked={applyTimeToAll}
                      onChange={(event) =>
                        onApplyTimeToAllChange(event.target.checked)
                      }
                      className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
                    />
                    시간 전체적용
                  </label>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default BaseInfoEventDateField;
