import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EventRecruitInfo.css";
import type { EventRecruitFormState } from "../../types";
import FormBox from "./FormBox";
import FormInput from "./FormInput";

type EventRecruitInfoProps = {
  value: EventRecruitFormState;
  onChange: (patch: Partial<EventRecruitFormState>) => void;
  maxRecruitEndDateTime?: string;
};

function toPickerDate(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function toFormDateTimeValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toValidDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function getStartOfDate(value?: Date) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function EventRecruitInfo({
  value,
  onChange,
  maxRecruitEndDateTime,
}: EventRecruitInfoProps) {
  const maxRecruitDateTime = toValidDate(maxRecruitEndDateTime);
  const eventEndDateStart = getStartOfDate(maxRecruitDateTime);

  return (
    <FormBox className="overflow-visible">
      <FormBox.Row
        label="모집마감일"
        required={!value.isRecruitEndOnSelection}
        contentClassName="items-start"
      >
        <div className="flex w-full max-w-105 flex-col gap-3">
          <DatePicker
            selected={toPickerDate(value.recruitEndDateTime)}
            onChange={(date: Date | null) =>
              onChange({
                recruitEndDateTime:
                  date instanceof Date ? toFormDateTimeValue(date) : "",
              })
            }
            showTimeSelect
            timeIntervals={10}
            timeFormat="HH:mm"
            dateFormat="yyyy-MM-dd HH:mm"
            disabled={value.isRecruitEndOnSelection}
            maxDate={maxRecruitDateTime}
            filterDate={(date) =>
              eventEndDateStart ? date <= eventEndDateStart : true
            }
            filterTime={(time) => {
              if (!maxRecruitDateTime) {
                return true;
              }

              if (!isSameDate(time, maxRecruitDateTime)) {
                return true;
              }

              return time <= maxRecruitDateTime;
            }}
            placeholderText="YYYY-MM-DD HH:mm"
            className={`font-pretendard border-border-control bg-bg-control text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 w-full rounded-lg border px-3 text-sm font-medium transition outline-none focus:ring-2 sm:h-12 sm:text-[15px] ${
              value.isRecruitEndOnSelection
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
            wrapperClassName="event-recruit-datepicker-wrapper"
            popperPlacement="bottom-start"
            calendarClassName="event-recruit-datepicker-calendar"
            popperClassName="event-recruit-datepicker-popper"
          />
          <div className="border-border-control/80 bg-bg-app/45 flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-fg-primary text-sm font-semibold">
                선정 시 마감
              </span>
              <span className="text-fg-muted text-[11px] leading-4">
                선정 완료 시 모집을 자동 종료합니다.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value.isRecruitEndOnSelection}
              aria-label={`선정 시 마감 ${value.isRecruitEndOnSelection ? "켜짐" : "꺼짐"}`}
              onClick={() =>
                onChange({
                  isRecruitEndOnSelection: !value.isRecruitEndOnSelection,
                  recruitEndDateTime: value.isRecruitEndOnSelection
                    ? value.recruitEndDateTime
                    : "",
                })
              }
              className={`focus-visible:ring-focus-ring/40 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                value.isRecruitEndOnSelection
                  ? "border-[#7f9ec0] bg-[#6b88ab]"
                  : "border-border-control bg-[#3b3f46]"
              }`}
            >
              <span className="sr-only">
                {value.isRecruitEndOnSelection
                  ? "선정 시 마감 켜짐"
                  : "선정 시 마감 꺼짐"}
              </span>
              <span
                aria-hidden="true"
                className={`h-5 w-5 rounded-full bg-[#f8fbff] shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
                  value.isRecruitEndOnSelection
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </FormBox.Row>

      <FormBox.Row
        label="모집규모"
        required
      >
        <FormInput
          type="number"
          min={0}
          value={value.recruitCount}
          onChange={(event) =>
            onChange({ recruitCount: Number(event.target.value) || 0 })
          }
          className="w-full max-w-55 text-sm font-medium sm:text-[15px]"
        />
      </FormBox.Row>

      <FormBox.Row label="전체 일정 참여" required>
        <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <label className="border-border-control/80 bg-bg-app/45 text-fg-primary inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium sm:text-[15px]">
            <input
              type="radio"
              name="isFullAttendanceRequired"
              checked={value.isFullAttendanceRequired}
              onChange={() => onChange({ isFullAttendanceRequired: true })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            필수
          </label>
          <label className="border-border-control/80 bg-bg-app/45 text-fg-primary inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium sm:text-[15px]">
            <input
              type="radio"
              name="isFullAttendanceRequired"
              checked={!value.isFullAttendanceRequired}
              onChange={() => onChange({ isFullAttendanceRequired: false })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            부분
          </label>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default EventRecruitInfo;
