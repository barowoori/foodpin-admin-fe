import DateRangeField from "../DateRangeField";
import type { EventFilterPatch, EventFilterState } from "../../types/event";

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
        startDate={value.eventStartAt}
        endDate={value.eventEndAt}
        onStartDateChange={(next) => onChange({ eventStartAt: next })}
        onEndDateChange={(next) => onChange({ eventEndAt: next })}
      />

      <DateRangeField
        label="모집마감일"
        startId="deadline-start-date"
        endId="deadline-end-date"
        startDate={value.deadlineStartAt}
        endDate={value.deadlineEndAt}
        onStartDateChange={(next) => onChange({ deadlineStartAt: next })}
        onEndDateChange={(next) => onChange({ deadlineEndAt: next })}
      />
    </div>
  );
}

export default EventDateField;
