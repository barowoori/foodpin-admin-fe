import { DateRangeField } from "../../components";
import type { ApprovalFilterPatch, ApprovalFilterState } from "../../types";

type DateFieldProps = {
  value: ApprovalFilterState;
  onChange: (patch: ApprovalFilterPatch) => void;
};

function DateField({ value, onChange }: DateFieldProps) {
  return (
    <div className="mt-6 grid w-full grid-cols-2 gap-y-5 lg:mt-8 lg:grid-cols-2 lg:gap-y-4">
      <DateRangeField
        label="요청일"
        startId="requested-date-start"
        endId="requested-date-end"
        startDate={value.requestedStartAt}
        endDate={value.requestedEndAt}
        onStartDateChange={(next) => onChange({ requestedStartAt: next })}
        onEndDateChange={(next) => onChange({ requestedEndAt: next })}
      />
      <DateRangeField
        label="처리일"
        startId="processed-date-start"
        endId="processed-date-end"
        startDate={value.processedStartAt}
        endDate={value.processedEndAt}
        onStartDateChange={(next) => onChange({ processedStartAt: next })}
        onEndDateChange={(next) => onChange({ processedEndAt: next })}
      />
    </div>
  );
}

export default DateField;
