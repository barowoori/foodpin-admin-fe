import { useMemo, useRef } from "react";
import Button from "../Button";
import FormSelect from "../FormSelect";
import type { BaseInfoFormState, EventDateTime, EventType } from "../../types";
import { REGION_DO_OPTIONS, getRegionSiOptions } from "../../utils";
import BaseInfoEventDateField from "./BaseInfoEventDateField";
import FormBox from "./FormBox";
import FormInput from "./FormInput";
import ParticipantCountRadioGroup from "./ParticipantCountRadioGroup";

const EVENT_CATEGORY_OPTIONS = [
  { value: "", label: "행사종류를 선택하세요" },
  { value: "CORPORATE", label: "기업행사" },
  { value: "PERSONAL", label: "개인행사" },
  { value: "SCHOOL", label: "학교행사" },
  { value: "LOCAL", label: "지역행사" },
  { value: "APARTMENT_MARKET", label: "아파트장터" },
  { value: "CELEBRITY_SUPPORT", label: "연예인 서포트" },
] satisfies Array<{ value: EventType | ""; label: string }>;

interface EventBaseInfoProps {
  value: BaseInfoFormState;
  onChange: (patch: Partial<BaseInfoFormState>) => void;
  onPeriodTimeChange: (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => void;
}

function EventBaseInfo({
  value,
  onChange,
  onPeriodTimeChange,
}: EventBaseInfoProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const regionSiOptions = useMemo(
    () => getRegionSiOptions(value.regionDo),
    [value.regionDo],
  );
  const selectedPhotoLabel = useMemo(() => {
    if (value.photoFiles.length > 0) {
      if (value.photoFiles.length === 1) {
        return value.photoFiles[0].name;
      }

      return `${value.photoFiles[0].name} 외 ${value.photoFiles.length - 1}개`;
    }

    if (value.fileIdList.length > 0) {
      return `${value.fileIdList.length}개 파일 선택됨`;
    }

    return "선택된 파일 없음";
  }, [value.fileIdList, value.photoFiles]);

  return (
    <>
      <FormBox>
        <FormBox.Row label="행사 사진">
          <div className="flex items-center gap-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                onChange({
                  photoFiles: files,
                  fileIdList: [],
                });
                event.target.value = "";
              }}
            />
            <FormInput
              readOnly
              value={selectedPhotoLabel}
              className="w-65"
            />
            <Button
              onClick={() => photoInputRef.current?.click()}
              className="h-11 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
            >
              파일 찾기
            </Button>
            <Button
              onClick={() => {
                onChange({
                  photoFiles: [],
                  fileIdList: [],
                });
              }}
              disabled={
                value.photoFiles.length === 0 && value.fileIdList.length === 0
              }
              className="h-11 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
            >
              삭제
            </Button>
          </div>
        </FormBox.Row>

        <FormBox.Row label="행사명" required>
          <FormInput
            value={value.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="행사명을 입력하세요"
            className="w-[320px]"
          />
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
            onSelectedDatesChange={(selectedDates) =>
              onChange({ selectedDates })
            }
            onPeriodStartDateChange={(periodStartDate) =>
              onChange({ periodStartDate })
            }
            onPeriodEndDateChange={(periodEndDate) =>
              onChange({ periodEndDate })
            }
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

        <FormBox.Row label="모집 URL">
          <FormInput
            value={value.recruitmentUrl}
            onChange={(event) =>
              onChange({ recruitmentUrl: event.target.value })
            }
            placeholder="https://"
            className="w-105"
          />
        </FormBox.Row>
      </FormBox>
    </>
  );
}

export default EventBaseInfo;
