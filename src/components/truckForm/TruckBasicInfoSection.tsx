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

const MAX_TRUCK_COLORS = 3;

const TRUCK_COLOR_HEX_MAP: Record<TruckColor, string> = {
  RED: "#FE4040",
  ORANGE: "#FF8A00",
  YELLOW: "#FFEA00",
  LIGHT_GREEN: "#B2DA08",
  GREEN: "#009900",
  SKY_BLUE: "#66D2FF",
  BLUE: "#007AFF",
  MINT: "#57F8C2",
  NAVY: "#15284F",
  PURPLE: "#A037DA",
  PINK: "#FF97D4",
  BROWN: "#764C24",
  BLACK: "#222222",
  WHITE: "#FFFFFF",
};

function TruckBasicInfoSection({
  value,
  onChange,
}: TruckBasicInfoSectionProps) {
  const selectedColors = TRUCK_COLOR_OPTIONS.filter((option) =>
    value.truckColors.includes(option.value),
  );
  const isSelectionFull = selectedColors.length >= MAX_TRUCK_COLORS;

  const handleToggleColor = (color: TruckColor) => {
    const isSelected = value.truckColors.includes(color);

    if (!isSelected && isSelectionFull) {
      return;
    }

    onChange({
      truckColors: toggleListItem<TruckColor>(value.truckColors, color),
    });
  };

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
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            {Array.from({ length: MAX_TRUCK_COLORS }).map((_, index) => {
              const option = selectedColors[index];

              if (!option) {
                return;
              }

              const colorHex = TRUCK_COLOR_HEX_MAP[option.value];

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleColor(option.value)}
                  className="relative h-14 w-14 cursor-pointer rounded-full border-2 border-[#d7d9dd] transition-transform hover:scale-105"
                  style={{ backgroundColor: colorHex }}
                  title={colorHex}
                >
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d7d9dd] bg-white text-[11px] leading-none font-semibold text-[#8f8f8f] shadow-sm">
                    x
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-fg-muted text-[15px] leading-6">
            푸드트럭의 대표 색상을 1~3개 선택해주세요
          </p>

          <div className="flex flex-wrap gap-3">
            {TRUCK_COLOR_OPTIONS.map((option) => {
              const colorHex = TRUCK_COLOR_HEX_MAP[option.value];
              const isSelected = value.truckColors.includes(option.value);
              const isDisabled = isSelectionFull && !isSelected;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleColor(option.value)}
                  disabled={isDisabled}
                  title={colorHex}
                  className={`relative h-12 w-12 rounded-full border-2 transition-all ${
                    option.value === "WHITE"
                      ? "border-[#d7d9dd]"
                      : "border-white/18"
                  } ${
                    isSelected
                      ? "ring-focus-ring ring-offset-bg-control scale-110 ring-2 ring-offset-2"
                      : "hover:scale-105"
                  } ${
                    isDisabled
                      ? "cursor-not-allowed opacity-35"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: colorHex }}
                >
                  {isSelected ? (
                    <>
                      <span className="absolute inset-0 rounded-full bg-white/10" />
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </FormBox.Row>

      <FormBox.Row label="푸드트럭명" required>
        <FormInput
          value={value.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="푸드트럭명을 입력하세요."
          className="w-full max-w-120"
        />
      </FormBox.Row>

      <FormBox.Row label="소개" required>
        <FormTextArea
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="트럭 소개를 입력하세요."
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
