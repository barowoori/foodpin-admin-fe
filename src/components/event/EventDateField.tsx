import { DateRangeField } from "../../components";
import type { EventFilterPatch, EventFilterState } from "../../types";

type EventDateFieldProps = {
  value: EventFilterState;
  onChange: (patch: EventFilterPatch) => void;
};

function EventDateField({ value, onChange }: EventDateFieldProps) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-x-18 gap-y-7">
      <DateRangeField
        label="행사기간"
        startId="event-start-date"
        endId="event-end-date"
        startDate={value.startDate}
        endDate={value.endDate}
        onStartDateChange={(next) => onChange({ startDate: next })}
        onEndDateChange={(next) => onChange({ endDate: next })}
      />

      <DateRangeField
        label="모집마감"
        startId="deadline-start-date"
        endId="deadline-end-date"
        startDate={value.recruitEndDateFrom}
        endDate={value.recruitEndDateTo}
        onStartDateChange={(next) => onChange({ recruitEndDateFrom: next })}
        onEndDateChange={(next) => onChange({ recruitEndDateTo: next })}
      />
    </div>
  );
}

export default EventDateField;
