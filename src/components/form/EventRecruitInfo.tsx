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
      <FormBox.Row label="모집마감일" required>
        <div className="w-[320px]">
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
            className="font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 w-full rounded-lg border px-3 transition outline-none focus:ring-2"
            wrapperClassName="event-recruit-datepicker-wrapper"
            popperPlacement="bottom-start"
            calendarClassName="event-recruit-datepicker-calendar"
            popperClassName="event-recruit-datepicker-popper"
          />
        </div>
      </FormBox.Row>

      <FormBox.Row label="모집규모" required>
        <FormInput
          type="number"
          min={0}
          value={value.recruitCount}
          onChange={(event) =>
            onChange({ recruitCount: Number(event.target.value) || 0 })
          }
          className="w-50"
        />
      </FormBox.Row>

      <FormBox.Row label="전체 일정 참여" required>
        <div className="flex items-center gap-5">
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="isFullAttendanceRequired"
              checked={value.isFullAttendanceRequired}
              onChange={() => onChange({ isFullAttendanceRequired: true })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            필수
          </label>
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
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
