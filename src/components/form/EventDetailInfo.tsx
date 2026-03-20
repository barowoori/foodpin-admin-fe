import type { EventDetailFormState } from "../../types";
import FormBox from "./FormBox";
import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";

type EventDetailInfoProps = {
  value: EventDetailFormState;
  onChange: (patch: Partial<EventDetailFormState>) => void;
};

function EventDetailInfo({ value, onChange }: EventDetailInfoProps) {
  return (
    <FormBox>
      <FormBox.Row label="상세설명" required contentClassName="items-stretch py-3">
        <FormTextArea
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="행사 상세 내용을 입력해주세요."
          className="max-w-180"
        />
      </FormBox.Row>

      <FormBox.Row label="유의사항" required contentClassName="items-stretch py-3">
        <FormTextArea
          value={value.guidelines}
          onChange={(event) => onChange({ guidelines: event.target.value })}
          placeholder="주의사항 및 안내사항"
          className="max-w-180"
        />
      </FormBox.Row>

      <FormBox.Row label="연락처" required>
        <FormInput
          value={value.contact}
          onChange={(event) => onChange({ contact: event.target.value })}
          placeholder="담당자 연락처"
          className="w-[320px]"
        />
      </FormBox.Row>

      <FormBox.Row label="전기 지원여부" required>
        <div className="flex items-center gap-5">
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="electricitySupportAvailability"
              checked={value.electricitySupportAvailability}
              onChange={() => onChange({ electricitySupportAvailability: true })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            가능
          </label>
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="electricitySupportAvailability"
              checked={!value.electricitySupportAvailability}
              onChange={() => onChange({ electricitySupportAvailability: false })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            불가
          </label>
        </div>
      </FormBox.Row>

      <FormBox.Row label="발전기 필요여부" required>
        <div className="flex items-center gap-5">
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="generatorRequirement"
              checked={value.generatorRequirement}
              onChange={() => onChange({ generatorRequirement: true })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            필요
          </label>
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="generatorRequirement"
              checked={!value.generatorRequirement}
              onChange={() => onChange({ generatorRequirement: false })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            불필요
          </label>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default EventDetailInfo;
