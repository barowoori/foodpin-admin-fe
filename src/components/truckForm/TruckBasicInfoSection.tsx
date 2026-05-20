import { FormBox, FormInput, FormTextArea } from "../form";
import type { TruckBasicInfoFormState, TruckColor } from "../../types";
import {
  TRUCK_BODY_TYPE_OPTIONS,
  TRUCK_COLOR_OPTIONS,
  toggleListItem,
} from "../../features/truckForm/formModel";
import TruckImageUploadField from "./TruckImageUploadField";

type TruckBasicInfoSectionProps = {
  value: TruckBasicInfoFormState;
  onChange: (patch: Partial<TruckBasicInfoFormState>) => void;
};

const TOGGLE_BUTTON_BASE_CLASS =
  "border-border-control bg-bg-app text-fg-subtle hover:bg-bg-control hover:text-fg-secondary peer-checked:border-[#73879d] peer-checked:bg-[#50647a] peer-checked:text-[#f3f6fa] inline-flex h-11 cursor-pointer items-center justify-center rounded-md border text-[15px] font-semibold transition-colors";

function TruckBasicInfoSection({
  value,
  onChange,
}: TruckBasicInfoSectionProps) {
  return (
    <FormBox className="overflow-visible">
      <FormBox.Row label="푸드트럭 사진">
        <TruckImageUploadField
          fileIdList={value.fileIdList}
          photoFiles={value.photoFiles}
          photoPaths={value.photoPaths}
          onChange={(next) => onChange(next)}
          maxCount={10}
          helperText="대표 사진은 최대 10개까지 등록할 수 있습니다."
        />
      </FormBox.Row>

      <FormBox.Row label="푸드트럭 대표 색상">
        <div className="flex flex-wrap gap-2">
          {TRUCK_COLOR_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.truckColors.includes(option.value)}
                onChange={() =>
                  onChange({
                    truckColors: toggleListItem<TruckColor>(
                      value.truckColors,
                      option.value,
                    ),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-20 px-4`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="푸드트럭명" required>
        <FormInput
          value={value.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="푸드트럭명을 입력하세요"
          className="w-full max-w-120"
        />
      </FormBox.Row>

      <FormBox.Row label="소개" required>
        <FormTextArea
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="트럭 소개를 입력하세요"
          className="min-h-28 max-w-160"
        />
      </FormBox.Row>

      <FormBox.Row label="푸드트럭 타입" required>
        <div className="flex flex-wrap gap-2">
          {TRUCK_BODY_TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="radio"
                name="truck-body-type"
                checked={value.bodyType === option.value}
                onChange={() => onChange({ bodyType: option.value })}
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-24 px-5`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckBasicInfoSection;
