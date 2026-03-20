import type { EventRecruitFormState } from "../../types";
import FormBox from "./FormBox";
import FormInput from "./FormInput";

type EventRecruitInfoProps = {
  value: EventRecruitFormState;
  onChange: (patch: Partial<EventRecruitFormState>) => void;
};

function EventRecruitInfo({ value, onChange }: EventRecruitInfoProps) {
  return (
    <FormBox>
      <FormBox.Row label="모집마감일" required>
        <FormInput
          type="datetime-local"
          value={value.recruitEndDateTime}
          onChange={(event) =>
            onChange({ recruitEndDateTime: event.target.value })
          }
          className="w-[320px]"
        />
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

      <FormBox.Row label="모집종료 조건" required>
        <div className="flex items-center gap-5">
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="isRecruitEndOnSelection"
              checked={value.isRecruitEndOnSelection}
              onChange={() => onChange({ isRecruitEndOnSelection: true })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            모집 완료시 종료
          </label>
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="isRecruitEndOnSelection"
              checked={!value.isRecruitEndOnSelection}
              onChange={() => onChange({ isRecruitEndOnSelection: false })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            날짜 기준 종료
          </label>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default EventRecruitInfo;
