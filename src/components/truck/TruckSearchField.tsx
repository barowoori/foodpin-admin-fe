import { FormSelect, InputWrapper } from "../../components";
import type { TruckFilterPatch, TruckFilterState } from "../../types";
import type { RegionSelectOption, TruckFilterSelectOption } from "../../utils";

type TruckSearchFieldProps = {
  value: TruckFilterState;
  regionDoOptions: RegionSelectOption[];
  regionSiOptions: RegionSelectOption[];
  categoryOptions: TruckFilterSelectOption[];
  typeOptions: TruckFilterSelectOption[];
  bodyTypeOptions: TruckFilterSelectOption[];
  onChange: (patch: TruckFilterPatch) => void;
};

function TruckSearchField({
  value,
  regionDoOptions,
  regionSiOptions,
  categoryOptions,
  typeOptions,
  bodyTypeOptions,
  onChange,
}: TruckSearchFieldProps) {
  return (
    <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-x-10 lg:gap-y-6">
      <InputWrapper>
        <InputWrapper.Label htmlFor="truck-search">
          푸드트럭명
        </InputWrapper.Label>
        <InputWrapper.Input
          id="truck-search"
          type="text"
          value={value.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="max-w-none md:w-56"
        />
      </InputWrapper>

      <div className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-3">
        <span className="font-pretendard tracking-brand text-fg-secondary text-[16px] font-medium">
          운영 지역
        </span>

        <div className="flex w-full items-start gap-2 lg:w-auto lg:items-end lg:gap-4">
          <FormSelect
            value={value.regionDo}
            onChange={(next) => onChange({ regionDo: next, regionSi: "" })}
            options={regionDoOptions}
            widthClassName="w-full lg:w-34"
          />

          <FormSelect
            value={value.regionSi}
            onChange={(next) => onChange({ regionSi: next })}
            options={regionSiOptions}
            widthClassName="w-full lg:w-34"
          />
        </div>
      </div>

      <InputWrapper>
        <InputWrapper.Label htmlFor="truck-category">
          메뉴 카테고리
        </InputWrapper.Label>
        <FormSelect
          id="truck-category"
          value={value.category}
          options={categoryOptions}
          onChange={(next) => onChange({ category: next })}
          widthClassName="w-full md:w-40"
        />
      </InputWrapper>

      <InputWrapper>
        <InputWrapper.Label htmlFor="truck-type">트럭 타입</InputWrapper.Label>
        <FormSelect
          id="truck-type"
          value={value.type}
          options={typeOptions}
          onChange={(next) =>
            onChange({ type: next as TruckFilterState["type"] })
          }
          widthClassName="w-full md:w-40"
        />
      </InputWrapper>

      <InputWrapper>
        <InputWrapper.Label htmlFor="truck-body-type">
          바디 타입
        </InputWrapper.Label>
        <FormSelect
          id="truck-body-type"
          value={value.bodyType}
          options={bodyTypeOptions}
          onChange={(next) =>
            onChange({ bodyType: next as TruckFilterState["bodyType"] })
          }
          widthClassName="w-full md:w-40"
        />
      </InputWrapper>
    </div>
  );
}

export default TruckSearchField;
