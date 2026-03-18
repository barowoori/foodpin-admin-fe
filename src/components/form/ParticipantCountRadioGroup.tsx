import type { ExpectedParticipants } from "../../types";

type ParticipantCountRadioGroupProps = {
  value: ExpectedParticipants;
  onChange: (value: ExpectedParticipants) => void;
  name?: string;
};

const PARTICIPANT_COUNT_OPTIONS: Array<{
  value: ExpectedParticipants;
  label: string;
}> = [
  { value: "UNDECIDED", label: "미정" },
  { value: "UNDER_50", label: "50명 미만" },
  { value: "UNDER_100", label: "100명 미만" },
  { value: "UNDER_150", label: "150명 미만" },
  { value: "UNDER_200", label: "200명 미만" },
  { value: "OVER_200", label: "200명 이상" },
];

function ParticipantCountRadioGroup({
  value,
  onChange,
  name = "participant-count",
}: ParticipantCountRadioGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {PARTICIPANT_COUNT_OPTIONS.map((option) => (
        <label
          key={option.value}
          className="text-fg-subtle hover:text-fg-secondary inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-medium tracking-[-0.01em] transition-colors"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="border-border-control bg-bg-app accent-focus-ring h-4.5 w-4.5 cursor-pointer"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export type ParticipantCountValue = ExpectedParticipants;
export default ParticipantCountRadioGroup;
