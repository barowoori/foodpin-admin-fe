import { useMemo } from "react";
import Button from "../Button";
import { FormBox, FormSelect } from "../form";
import type { TruckOperationFormState } from "../../types";
import { REGION_DO_OPTIONS, getRegionSiOptions } from "../../utils";

type TruckOperationSectionProps = {
  value: TruckOperationFormState;
  onChange: (patch: Partial<TruckOperationFormState>) => void;
};

function BooleanRadioGroup({
  name,
  value,
  trueLabel,
  falseLabel,
  onChange,
}: {
  name: string;
  value: boolean | null;
  trueLabel: string;
  falseLabel: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
        <input
          type="radio"
          name={name}
          checked={value === true}
          onChange={() => onChange(true)}
          className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
        />
        {trueLabel}
      </label>
      <label className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]">
        <input
          type="radio"
          name={name}
          checked={value === false}
          onChange={() => onChange(false)}
          className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
        />
        {falseLabel}
      </label>
    </div>
  );
}

function TruckOperationSection({
  value,
  onChange,
}: TruckOperationSectionProps) {
  const regionSiOptions = useMemo(
    () => getRegionSiOptions(value.regionDo),
    [value.regionDo],
  );

  const handleAddRegion = () => {
    const selectedCode = value.regionSi || value.regionDo;
    if (!selectedCode) {
      return;
    }

    const optionList = value.regionSi ? regionSiOptions : REGION_DO_OPTIONS;
    const selectedRegion = optionList.find(
      (option) => option.value === selectedCode,
    );
    if (!selectedRegion) {
      return;
    }

    if (value.regions.some((region) => region.code === selectedCode)) {
      return;
    }

    onChange({
      regions: [
        ...value.regions,
        { code: selectedCode, name: selectedRegion.label },
      ],
      regionDo: "",
      regionSi: "",
    });
  };

  return (
    <FormBox>
      <FormBox.Row
        label="운영 지역"
        required
        contentClassName="items-start py-3"
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <FormSelect
              value={value.regionDo}
              onChange={(next) => onChange({ regionDo: next, regionSi: "" })}
              options={REGION_DO_OPTIONS}
              widthClassName="w-34"
            />
            <FormSelect
              value={value.regionSi}
              onChange={(next) => onChange({ regionSi: next })}
              options={regionSiOptions}
              widthClassName="w-34"
            />
            <Button
              onClick={handleAddRegion}
              className="h-11 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
            >
              지역 추가
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {value.regions.map((region) => (
              <button
                type="button"
                key={region.code}
                onClick={() =>
                  onChange({
                    regions: value.regions.filter(
                      (item) => item.code !== region.code,
                    ),
                  })
                }
                className="border-border-control bg-bg-app text-fg-secondary inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
              >
                <span>{region.name}</span>
                <span className="text-fg-muted">×</span>
              </button>
            ))}
          </div>
        </div>
      </FormBox.Row>

      <FormBox.Row label="전기 사용 여부" required>
        <BooleanRadioGroup
          name="electricityUsage"
          value={value.electricityUsage}
          trueLabel="사용"
          falseLabel="미사용"
          onChange={(electricityUsage) => onChange({ electricityUsage })}
        />
      </FormBox.Row>

      <FormBox.Row label="가스 사용 여부" required>
        <BooleanRadioGroup
          name="gasUsage"
          value={value.gasUsage}
          trueLabel="사용"
          falseLabel="미사용"
          onChange={(gasUsage) => onChange({ gasUsage })}
        />
      </FormBox.Row>

      <FormBox.Row label="자가발전 가능 여부" required>
        <BooleanRadioGroup
          name="selfGenerationAvailability"
          value={value.selfGenerationAvailability}
          trueLabel="가능"
          falseLabel="불가능"
          onChange={(selfGenerationAvailability) =>
            onChange({ selfGenerationAvailability })
          }
        />
      </FormBox.Row>

      <FormBox.Row label="케이터링 가능 여부" required>
        <BooleanRadioGroup
          name="isCatering"
          value={value.isCatering}
          trueLabel="가능"
          falseLabel="불가능"
          onChange={(isCatering) => onChange({ isCatering })}
        />
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckOperationSection;
