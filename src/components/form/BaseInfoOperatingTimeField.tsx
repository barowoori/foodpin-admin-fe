import type { EventDateMode, EventDateTime, EventOperatingTimeMode } from "../../types";
import { formatIsoDateCompact, getIsoDateRange } from "../../utils";
import FormInput from "./FormInput";

type BaseInfoOperatingTimeFieldProps = {
  eventDateMode: EventDateMode;
  selectedDates: string[];
  periodStartDate: string;
  periodEndDate: string;
  periodTimeByDate: Record<string, EventDateTime>;
  applyTimeToAll: boolean;
  operatingTimeInputMode: EventOperatingTimeMode;
  operatingTime: string;
  onOperatingTimeInputModeChange: (mode: EventOperatingTimeMode) => void;
  onOperatingTimeChange: (value: string) => void;
  onPeriodTimeChange: (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => void;
  onApplyTimeToAllChange: (value: boolean) => void;
};

function toSortedSelectedDates(selectedDates: string[]) {
  return [...new Set(selectedDates)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function BaseInfoOperatingTimeField({
  eventDateMode,
  selectedDates,
  periodStartDate,
  periodEndDate,
  periodTimeByDate,
  applyTimeToAll,
  operatingTimeInputMode,
  operatingTime,
  onOperatingTimeInputModeChange,
  onOperatingTimeChange,
  onPeriodTimeChange,
  onApplyTimeToAllChange,
}: BaseInfoOperatingTimeFieldProps) {
  const activeDates =
    eventDateMode === "PERIOD"
      ? getIsoDateRange(periodStartDate, periodEndDate)
      : toSortedSelectedDates(selectedDates);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
          <input
            type="radio"
            name="operating-time-mode"
            checked={operatingTimeInputMode === "SCHEDULE"}
            onChange={() => onOperatingTimeInputModeChange("SCHEDULE")}
            className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
          />
          날짜별 시작/종료 시간
        </label>

        <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
          <input
            type="radio"
            name="operating-time-mode"
            checked={operatingTimeInputMode === "TEXT"}
            onChange={() => onOperatingTimeInputModeChange("TEXT")}
            className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
          />
          행사 전체 직접 입력
        </label>
      </div>

      {operatingTimeInputMode === "TEXT" ? (
        <div className="flex w-full max-w-180 flex-col gap-2">
          <FormInput
            value={operatingTime}
            maxLength={50}
            onChange={(event) => onOperatingTimeChange(event.target.value)}
            placeholder="예: 매일 10:00~22:00 (날씨에 따라 변동)"
            className="w-full"
          />
          <p className="text-fg-muted text-xs">최대 50자까지 입력할 수 있습니다.</p>
        </div>
      ) : activeDates.length > 0 ? (
        <div className="mt-1 flex flex-col gap-2">
          {activeDates.map((date, index) => {
            const currentTime = periodTimeByDate[date] ?? {
              startTime: "",
              endTime: "",
            };

            return (
              <div
                key={date}
                className="flex flex-col gap-2 rounded-lg border border-white/8 bg-black/10 px-3 py-3 sm:flex-row sm:items-center"
              >
                <span className="text-fg-subtle w-24 text-[15px] font-medium">
                  {formatIsoDateCompact(date)}
                </span>
                <div className="flex items-center gap-2">
                  <FormInput
                    type="time"
                    value={currentTime.startTime}
                    onChange={(event) => {
                      const nextStartTime = event.target.value;
                      onPeriodTimeChange(date, "startTime", nextStartTime);

                      if (
                        currentTime.endTime &&
                        nextStartTime &&
                        currentTime.endTime < nextStartTime
                      ) {
                        onPeriodTimeChange(date, "endTime", "");
                      }
                    }}
                    className="w-34"
                  />
                  <span className="text-fg-subtle text-[15px]">~</span>
                  <FormInput
                    type="time"
                    value={currentTime.endTime}
                    min={currentTime.startTime || undefined}
                    onChange={(event) =>
                      onPeriodTimeChange(date, "endTime", event.target.value)
                    }
                    className="w-34"
                  />
                </div>
                {index === 0 ? (
                  <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[14px]">
                    <input
                      type="checkbox"
                      checked={applyTimeToAll}
                      onChange={(event) =>
                        onApplyTimeToAllChange(event.target.checked)
                      }
                      className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
                    />
                    시간을 전체 날짜에 동일하게 적용
                  </label>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-fg-muted text-sm">
          먼저 행사기간을 선택하면 날짜별 운영시간을 입력할 수 있습니다.
        </p>
      )}
    </div>
  );
}

export default BaseInfoOperatingTimeField;
