import DateRangeField from "../DateRangeField";
import type {
  ApprovalFilterPatch,
  ApprovalFilterState,
} from "../../types/approval";

type DateFieldProps = {
  value: ApprovalFilterState;
  onChange: (patch: ApprovalFilterPatch) => void;
};

function DateField({ value, onChange }: DateFieldProps) {
  return (
    <div className="mt-10 flex w-full flex-wrap gap-4">
      <DateRangeField
        label="요청일"
        startId="requested-date-start"
        endId="requested-date-end"
        startDate={value.startAt}
        endDate={value.endAt}
        onStartDateChange={(next) => onChange({ startAt: next })}
        onEndDateChange={(next) => onChange({ endAt: next })}
      />
      <DateRangeField
        label="처리일"
        startId="processed-date-start"
        endId="processed-date-end"
      />
    </div>
  );
}

export default DateField;
