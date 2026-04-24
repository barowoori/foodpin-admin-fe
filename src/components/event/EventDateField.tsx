import { DateRangeField } from "../../components";
import type { EventFilterPatch, EventFilterState } from "../../types";

type EventDateFieldProps = {
  value: EventFilterState;
  onChange: (patch: EventFilterPatch) => void;
};

function EventDateField({ value, onChange }: EventDateFieldProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-5 lg:mt-7 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
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
