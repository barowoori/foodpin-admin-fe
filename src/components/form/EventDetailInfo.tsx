import { useState } from "react";
import type { EventDetailFormState } from "../../types";
import {
  DESCRIPTION_LIMIT,
  GUIDELINES_LIMIT,
  getMaxLengthMessage,
  getMinLengthMessage,
  validateTextLength,
} from "../../features/eventForm/textLengthValidation";
import FormBox from "./FormBox";
import FormTextArea from "./FormTextArea";

type EventDetailInfoProps = {
  value: EventDetailFormState;
  onChange: (patch: Partial<EventDetailFormState>) => void;
  showTextValidationError?: boolean;
};

function EventDetailInfo({
  value,
  onChange,
  showTextValidationError = false,
}: EventDetailInfoProps) {
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
  const [isGuidelinesTouched, setIsGuidelinesTouched] = useState(false);
  const [isDescriptionMaxExceeded, setIsDescriptionMaxExceeded] = useState(false);
  const [isGuidelinesMaxExceeded, setIsGuidelinesMaxExceeded] = useState(false);

  const descriptionValidation = validateTextLength(
    value.description,
    DESCRIPTION_LIMIT,
  );
  const guidelinesValidation = validateTextLength(
    value.guidelines,
    GUIDELINES_LIMIT,
  );
  const showDescriptionMinError =
    (isDescriptionTouched || showTextValidationError) &&
    descriptionValidation.isUnderMin;
  const showGuidelinesMinError =
    (isGuidelinesTouched || showTextValidationError) &&
    guidelinesValidation.isUnderMin;
  const showDescriptionMaxError =
    isDescriptionMaxExceeded || descriptionValidation.isOverMax;
  const showGuidelinesMaxError =
    isGuidelinesMaxExceeded || guidelinesValidation.isOverMax;

  return (
    <FormBox>
      <FormBox.Row label="전기 지원여부" required>
        <div className="flex items-center gap-5">
          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="electricitySupportAvailability"
              checked={value.electricitySupportAvailability === true}
              onChange={() =>
                onChange({ electricitySupportAvailability: true })
              }
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            지원
          </label>

          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="electricitySupportAvailability"
              checked={value.electricitySupportAvailability === false}
              onChange={() =>
                onChange({ electricitySupportAvailability: false })
              }
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            미지원
          </label>

          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="electricitySupportAvailability"
              checked={value.electricitySupportAvailability === null}
              onChange={() =>
                onChange({ electricitySupportAvailability: null })
              }
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            미정
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
            지참 필수
          </label>

          <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
            <input
              type="radio"
              name="generatorRequirement"
              checked={!value.generatorRequirement}
              onChange={() => onChange({ generatorRequirement: false })}
              className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
            />
            무관
          </label>
        </div>
      </FormBox.Row>
      <FormBox.Row
        label="상세설명"
        required
        contentClassName="items-stretch py-3"
      >
        <div className="w-full max-w-180">
          <div className="relative">
            <FormTextArea
              value={value.description}
              onChange={(event) => {
                const next = event.target.value;
                if (next.length > DESCRIPTION_LIMIT.max) {
                  setIsDescriptionMaxExceeded(true);
                  return;
                }

                setIsDescriptionMaxExceeded(false);
                onChange({ description: next });
              }}
              onBlur={() => setIsDescriptionTouched(true)}
              placeholder="행사 상세 내용을 입력해주세요."
              className="pr-20 pb-7"
            />
            <span
              className={`pointer-events-none absolute right-3 bottom-2 text-[12px] ${
                showDescriptionMaxError ? "text-[#ff5c5c]" : "text-fg-muted"
              }`}
            >
              {descriptionValidation.length} / {DESCRIPTION_LIMIT.max}
            </span>
          </div>
          {showDescriptionMaxError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMaxLengthMessage(DESCRIPTION_LIMIT.max)}
            </p>
          ) : null}
          {!showDescriptionMaxError && showDescriptionMinError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMinLengthMessage(DESCRIPTION_LIMIT.min)}
            </p>
          ) : null}
        </div>
      </FormBox.Row>
      <FormBox.Row
        label="유의사항"
        required
        contentClassName="items-stretch py-3"
      >
        <div className="w-full max-w-180">
          <div className="relative">
            <FormTextArea
              value={value.guidelines}
              onChange={(event) => {
                const next = event.target.value;
                if (next.length > GUIDELINES_LIMIT.max) {
                  setIsGuidelinesMaxExceeded(true);
                  return;
                }

                setIsGuidelinesMaxExceeded(false);
                onChange({ guidelines: next });
              }}
              onBlur={() => setIsGuidelinesTouched(true)}
              placeholder="주의사항 및 안내사항"
              className="pr-20 pb-7"
            />
            <span
              className={`pointer-events-none absolute right-3 bottom-2 text-[12px] ${
                showGuidelinesMaxError ? "text-[#ff5c5c]" : "text-fg-muted"
              }`}
            >
              {guidelinesValidation.length} / {GUIDELINES_LIMIT.max}
            </span>
          </div>
          {showGuidelinesMaxError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMaxLengthMessage(GUIDELINES_LIMIT.max)}
            </p>
          ) : null}
          {!showGuidelinesMaxError && showGuidelinesMinError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMinLengthMessage(GUIDELINES_LIMIT.min)}
            </p>
          ) : null}
        </div>
      </FormBox.Row>

      <FormBox.Row label="연락처" required contentClassName="items-stretch py-3">
        <FormTextArea
          value={value.contact}
          onChange={(event) => onChange({ contact: event.target.value })}
          placeholder="담당자 연락처"
          className="max-w-120 min-h-11 resize-y"
        />
      </FormBox.Row>
    </FormBox>
  );
}

export default EventDetailInfo;
