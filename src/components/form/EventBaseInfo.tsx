import { useEffect, useMemo, useRef, useState } from "react";
import { saveFile } from "../../apis";
import Button from "../Button";
import FormSelect from "../FormSelect";
import type { BaseInfoFormState, EventDateTime, EventType } from "../../types";
import { REGION_DO_OPTIONS, getRegionSiOptions } from "../../utils";
import {
  EVENT_NAME_LIMIT,
  getMaxLengthMessage,
  getMinLengthMessage,
  validateTextLength,
} from "../../pages/eventForm/textLengthValidation";
import BaseInfoEventDateField from "./BaseInfoEventDateField";
import FormBox from "./FormBox";
import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import ParticipantCountRadioGroup from "./ParticipantCountRadioGroup";

const EVENT_CATEGORY_OPTIONS = [
  { value: "", label: "행사종류를 선택하세요" },
  { value: "CORPORATE", label: "기업행사" },
  { value: "PERSONAL", label: "개인행사" },
  { value: "SCHOOL", label: "학교행사" },
  { value: "LOCAL", label: "지역행사" },
  { value: "APARTMENT_MARKET", label: "아파트장터" },
  { value: "CELEBRITY_SUPPORT", label: "연예인서포트" },
] satisfies Array<{ value: EventType | ""; label: string }>;

interface EventBaseInfoProps {
  value: BaseInfoFormState;
  onChange: (patch: Partial<BaseInfoFormState>) => void;
  showNameValidationError?: boolean;
  onPeriodTimeChange: (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => void;
}

function EventBaseInfo({
  value,
  onChange,
  showNameValidationError = false,
  onPeriodTimeChange,
}: EventBaseInfoProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isNameMaxExceeded, setIsNameMaxExceeded] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const regionSiOptions = useMemo(
    () => getRegionSiOptions(value.regionDo),
    [value.regionDo],
  );
  const nameValidation = validateTextLength(value.name, EVENT_NAME_LIMIT);
  const showNameMinError =
    (isNameTouched || showNameValidationError) && nameValidation.isUnderMin;
  const showNameMaxError = isNameMaxExceeded || nameValidation.isOverMax;
  const localPhotoPreviewUrls = useMemo(
    () => value.photoFiles.map((file) => URL.createObjectURL(file)),
    [value.photoFiles],
  );
  const photoPreviewUrls =
    localPhotoPreviewUrls.length > 0 ? localPhotoPreviewUrls : value.photoPaths;
  const hasPhotoPreview = photoPreviewUrls.length > 0;

  const selectedPhotoLabel = useMemo(() => {
    if (value.photoFiles.length > 0) {
      if (value.photoFiles.length === 1) {
        return value.photoFiles[0].name;
      }

      return `${value.photoFiles[0].name} 외 ${value.photoFiles.length - 1}개`;
    }

    if (value.fileIdList.length > 0) {
      return `${value.fileIdList.length}개 파일 선택`;
    }

    return "선택된 파일 없음";
  }, [value.fileIdList, value.photoFiles]);

  useEffect(() => {
    return () => {
      localPhotoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [localPhotoPreviewUrls]);

  return (
    <FormBox className="overflow-visible">
      <FormBox.Row label="행사 사진">
        <div className="flex w-full flex-col gap-2">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";

              if (files.length === 0) {
                return;
              }

              setIsPhotoUploading(true);

              try {
                const uploadedFileIds = await Promise.all(
                  files.map((file) => saveFile(file)),
                );
                onChange({
                  photoFiles: files,
                  photoPaths: [],
                  fileIdList: uploadedFileIds,
                });
              } catch (error) {
                console.error("Failed to upload photos", error);
                alert("이미지 업로드에 실패했습니다.");
              } finally {
                setIsPhotoUploading(false);
              }
            }}
          />

          {hasPhotoPreview ? (
            <div className="flex flex-wrap gap-3">
              {photoPreviewUrls.map((photoUrl, index) => (
                <div
                  key={`${photoUrl}-${index}`}
                  className="border-border-control relative h-28 w-42 overflow-hidden rounded-md border bg-[#1f2329]"
                >
                  <img
                    src={photoUrl}
                    alt={`행사 사진 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          photoFiles: [],
                          photoPaths: [],
                          fileIdList: [],
                        })
                      }
                      className="absolute top-1 right-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-black/65 text-[16px] leading-none font-medium text-white hover:bg-black/80"
                      aria-label="이미지 삭제"
                    >
                      <span className="relative block h-3.5 w-3.5">
                        <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 rotate-45 bg-white" />
                        <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 -rotate-45 bg-white" />
                      </span>
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FormInput readOnly value={selectedPhotoLabel} className="w-65" />
              <Button
                onClick={() => photoInputRef.current?.click()}
                disabled={isPhotoUploading}
                className="h-11 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
              >
                {isPhotoUploading ? "업로드 중.." : "파일 찾기"}
              </Button>
            </div>
          )}
        </div>
      </FormBox.Row>

      <FormBox.Row label="행사명" required>
        <div className="w-[320px]">
          <div className="relative">
            <FormTextArea
              value={value.name}
              onChange={(event) => {
                const next = event.target.value;
                if (next.length > EVENT_NAME_LIMIT.max) {
                  setIsNameMaxExceeded(true);
                  return;
                }

                setIsNameMaxExceeded(false);
                onChange({ name: next });
              }}
              onBlur={() => setIsNameTouched(true)}
              placeholder="행사명을 입력하세요"
              className="min-h-11 resize-y pr-18 pb-7"
            />
            <span
              className={`pointer-events-none absolute right-3 bottom-2 text-[12px] ${
                showNameMaxError ? "text-[#ff5c5c]" : "text-fg-muted"
              }`}
            >
              {nameValidation.length} / {EVENT_NAME_LIMIT.max}
            </span>
          </div>
          {showNameMaxError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMaxLengthMessage(EVENT_NAME_LIMIT.max)}
            </p>
          ) : null}
          {!showNameMaxError && showNameMinError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMinLengthMessage(EVENT_NAME_LIMIT.min)}
            </p>
          ) : null}
        </div>
      </FormBox.Row>

      <FormBox.Row label="행사 종류" required>
        <FormSelect
          value={value.type}
          onChange={(next) => onChange({ type: next as EventType | "" })}
          options={[...EVENT_CATEGORY_OPTIONS]}
          widthClassName="w-[320px]"
        />
      </FormBox.Row>

      <FormBox.Row
        label="행사 일시"
        required
        contentClassName="items-start py-3"
      >
        <BaseInfoEventDateField
          mode={value.eventDateMode}
          selectedDates={value.selectedDates}
          periodStartDate={value.periodStartDate}
          periodEndDate={value.periodEndDate}
          periodTimeByDate={value.periodTimeByDate}
          applyTimeToAll={value.applyTimeToAll}
          onModeChange={(eventDateMode) => onChange({ eventDateMode })}
          onSelectedDatesChange={(selectedDates) => onChange({ selectedDates })}
          onPeriodStartDateChange={(periodStartDate) =>
            onChange({ periodStartDate })
          }
          onPeriodEndDateChange={(periodEndDate) => onChange({ periodEndDate })}
          onPeriodTimeChange={onPeriodTimeChange}
          onApplyTimeToAllChange={(applyTimeToAll) =>
            onChange({ applyTimeToAll })
          }
        />
      </FormBox.Row>

      <FormBox.Row label="행사 지역" required>
        <div className="flex items-end gap-4">
          <FormSelect
            value={value.regionDo}
            onChange={(next) => {
              onChange({ regionDo: next, regionSi: "" });
            }}
            options={REGION_DO_OPTIONS}
            widthClassName="w-34"
          />
          <FormSelect
            value={value.regionSi}
            onChange={(regionSi) => onChange({ regionSi })}
            options={regionSiOptions}
            widthClassName="w-34"
          />
        </div>
      </FormBox.Row>

      <FormBox.Row label="참여 인원" required>
        <ParticipantCountRadioGroup
          value={value.expectedParticipants}
          onChange={(expectedParticipants) =>
            onChange({ expectedParticipants })
          }
          name="expected-participant-count"
        />
      </FormBox.Row>
    </FormBox>
  );
}

export default EventBaseInfo;
