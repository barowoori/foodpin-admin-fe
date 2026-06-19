import type {
  EventDateMode,
  EventDateTime,
  EventOperatingTimeMode,
} from "../../types";
import { DEFAULT_OPERATING_TIME_VALUE, getIsoDateRange } from "../../utils";
import FormInput from "./FormInput";

type BaseInfoOperatingTimeFieldProps = {
  eventDateMode: EventDateMode;
  selectedDates: string[];
  periodStartDate: string;
  periodEndDate: string;
  periodTimeByDate: Record<string, EventDateTime>;
  operatingTimeInputMode: EventOperatingTimeMode;
  operatingTime: string;
  onOperatingTimeInputModeChange: (mode: EventOperatingTimeMode) => void;
  onOperatingTimeChange: (value: string) => void;
  onPeriodTimeChange: (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => void;
};

function toSortedSelectedDates(selectedDates: string[]) {
  return [...new Set(selectedDates)].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
}

function BaseInfoOperatingTimeField({
  eventDateMode,
  selectedDates,
  periodStartDate,
  periodEndDate,
  periodTimeByDate,
  operatingTimeInputMode,
  operatingTime,
  onOperatingTimeInputModeChange,
  onOperatingTimeChange,
  onPeriodTimeChange,
}: BaseInfoOperatingTimeFieldProps) {
  const activeDates =
    eventDateMode === "PERIOD"
      ? getIsoDateRange(periodStartDate, periodEndDate)
      : toSortedSelectedDates(selectedDates);
  const referenceDate = activeDates[0] ?? "";
  const sharedTime = referenceDate
    ? (periodTimeByDate[referenceDate] ?? {
        startTime: DEFAULT_OPERATING_TIME_VALUE,
        endTime: DEFAULT_OPERATING_TIME_VALUE,
      })
    : {
        startTime: DEFAULT_OPERATING_TIME_VALUE,
        endTime: DEFAULT_OPERATING_TIME_VALUE,
      };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col items-start gap-4">
        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
          <input
            type="radio"
            name="operating-time-mode"
            checked={operatingTimeInputMode === "SCHEDULE"}
            onChange={() => onOperatingTimeInputModeChange("SCHEDULE")}
            className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
          />
          매일 운영시간이 같아요
        </label>

        {operatingTimeInputMode === "SCHEDULE" ? (
          activeDates.length > 0 ? (
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FormInput
                  type="time"
                  value={sharedTime.startTime}
                  onChange={(event) => {
                    const nextStartTime = event.target.value;
                    onPeriodTimeChange(
                      referenceDate,
                      "startTime",
                      nextStartTime,
                    );

                    if (
                      sharedTime.endTime &&
                      nextStartTime &&
                      sharedTime.endTime < nextStartTime
                    ) {
                      onPeriodTimeChange(
                        referenceDate,
                        "endTime",
                        nextStartTime,
                      );
                    }
                  }}
                  className="w-34"
                />
                <span className="text-fg-subtle text-[15px]">~</span>
                <FormInput
                  type="time"
                  value={sharedTime.endTime}
                  min={sharedTime.startTime || undefined}
                  onChange={(event) =>
                    onPeriodTimeChange(
                      referenceDate,
                      "endTime",
                      event.target.value,
                    )
                  }
                  className="w-34"
                />
              </div>
            </div>
          ) : (
            <></>
          )
        ) : null}

        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
          <input
            type="radio"
            name="operating-time-mode"
            checked={operatingTimeInputMode === "TEXT"}
            onChange={() => onOperatingTimeInputModeChange("TEXT")}
            className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
          />
          직접 입력
        </label>

        {operatingTimeInputMode === "TEXT" ? (
          <div className="flex w-full max-w-180 flex-col gap-2">
            <FormInput
              value={operatingTime}
              maxLength={50}
              onChange={(event) => onOperatingTimeChange(event.target.value)}
              placeholder="예: 매일 10:00~22:00 (날씨에 따라 변동)"
              className="w-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BaseInfoOperatingTimeField;
