import ApprovalStatusSelect from "../ApprovalStatusSelect";
import InputWrapper from "../InputWrapper";
import type { EventFilterPatch, EventFilterState } from "../../types/event";

type SelectOption = {
  value: string;
  label: string;
};

type EventSearchFieldProps = {
  value: EventFilterState;
  regionDoOptions: SelectOption[];
  regionSiOptions: SelectOption[];
  onChange: (patch: EventFilterPatch) => void;
};

function EventSearchField({
  value,
  regionDoOptions,
  regionSiOptions,
  onChange,
}: EventSearchFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-x-18 gap-y-7">
      <InputWrapper>
        <InputWrapper.Label htmlFor="event-name">행사명</InputWrapper.Label>
        <InputWrapper.Input
          id="event-name"
          type="text"
          value={value.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </InputWrapper>

      <div className="flex items-center gap-3">
        <span className="font-pretendard tracking-brand text-fg-secondary text-[16px] font-medium">
          행사지역
        </span>

        <div className="flex items-end gap-4">
          <ApprovalStatusSelect
            value={value.regionDo}
            onChange={(next) => onChange({ regionDo: next, regionSi: "" })}
            options={regionDoOptions}
            widthClassName="w-34"
          />

          <ApprovalStatusSelect
            value={value.regionSi}
            onChange={(next) => onChange({ regionSi: next })}
            options={regionSiOptions}
            widthClassName="w-34"
          />
        </div>
      </div>
    </div>
  );
}

export default EventSearchField;
