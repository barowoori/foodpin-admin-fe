import { useState } from "react";
import type {
  EventTargetFormState,
  PriceRange,
  SaleType,
  TruckType,
} from "../../types";
import {
  CATERING_DETAIL_LIMIT,
  getMaxLengthMessage,
  getMinLengthMessage,
  validateTextLength,
} from "../../features/eventForm/textLengthValidation";
import FormBox from "./FormBox";
import FormTextArea from "./FormTextArea";

type EventTargetInfoProps = {
  value: EventTargetFormState;
  onChange: (patch: Partial<EventTargetFormState>) => void;
  showCateringValidationError?: boolean;
};

type Option<T extends string> = {
  value: T;
  label: string;
};

const TRUCK_TYPE_OPTIONS: Array<Option<TruckType>> = [
  { value: "SNACK", label: "간식차" },
  { value: "MEAL", label: "식사차" },
  { value: "STREET_FOOD", label: "분식차" },
  { value: "COFFEE", label: "커피차" },
];

const EVENT_CATEGORY_OPTIONS = [
  { value: "C01", label: "한식" },
  { value: "C02", label: "양식" },
  { value: "C03", label: "일식" },
  { value: "C04", label: "중식" },
  { value: "C05", label: "분식" },
  { value: "C06", label: "세계음식" },
  { value: "C07", label: "기타" },
] as const;

const SALE_TYPE_OPTIONS: Array<Option<SaleType>> = [
  { value: "NORMAL", label: "일반판매" },
  { value: "CATERING", label: "케이터링" },
];

const PRICE_RANGE_OPTIONS: Array<Option<PriceRange>> = [
  { value: "UNDER_7000", label: "7000원 미만" },
  { value: "UNDER_8000", label: "8000원 미만" },
  { value: "UNDER_9000", label: "9000원 미만" },
  { value: "UNDER_10000", label: "1만원 미만" },
  { value: "NO_MATTER", label: "상관없음" },
];

function toggleListItem<T extends string>(list: T[], target: T): T[] {
  if (list.includes(target)) {
    return list.filter((item) => item !== target);
  }
  return [...list, target];
}

const TOGGLE_BUTTON_BASE_CLASS =
  "border-border-control bg-bg-app text-fg-subtle hover:bg-bg-control hover:text-fg-secondary peer-checked:border-[#73879d] peer-checked:bg-[#50647a] peer-checked:text-[#f3f6fa] peer-focus-visible:border-focus-ring peer-focus-visible:ring-focus-ring/40 inline-flex h-11 cursor-pointer items-center justify-center rounded-md border text-[15px] font-semibold transition-colors peer-focus-visible:ring-2";

function EventTargetInfo({
  value,
  onChange,
  showCateringValidationError = false,
}: EventTargetInfoProps) {
  const isCateringSaleType = value.saleType === "CATERING";
  const isNormalSaleType = value.saleType === "NORMAL";
  const [isCateringTouched, setIsCateringTouched] = useState(false);
  const [isCateringMaxExceeded, setIsCateringMaxExceeded] = useState(false);
  const cateringValidation = validateTextLength(
    value.cateringDetail,
    CATERING_DETAIL_LIMIT,
  );
  const showCateringMinError =
    isCateringSaleType &&
    (isCateringTouched || showCateringValidationError) &&
    cateringValidation.isUnderMin;
  const showCateringMaxError =
    isCateringSaleType &&
    (isCateringMaxExceeded || cateringValidation.isOverMax);

  return (
    <FormBox>
      <FormBox.Row label="푸드트럭 유형" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRUCK_TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.truckTypes.includes(option.value)}
                onChange={() =>
                  onChange({
                    truckTypes: toggleListItem(value.truckTypes, option.value),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-20 px-5`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="메뉴 카테고리" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {EVENT_CATEGORY_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.eventCategoryCodeList.includes(option.value)}
                onChange={() =>
                  onChange({
                    eventCategoryCodeList: toggleListItem(
                      value.eventCategoryCodeList,
                      option.value,
                    ),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-16 px-4`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="판매유형" required>
        <div className="flex flex-wrap items-center gap-5">
          {SALE_TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="text-fg-subtle inline-flex items-center gap-1.5 text-[15px]"
            >
              <input
                type="radio"
                name="saleType"
                checked={value.saleType === option.value}
                onChange={() =>
                  {
                    if (option.value !== "CATERING") {
                      setIsCateringTouched(false);
                      setIsCateringMaxExceeded(false);
                    }
                    onChange({
                      saleType: option.value,
                      ...(option.value === "CATERING" ? { priceRange: "" } : {}),
                    });
                  }
                }
                className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="희망 가격대" contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-5">
          {PRICE_RANGE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`text-fg-subtle inline-flex items-center gap-1.5 text-[15px] ${
                !isNormalSaleType ? "opacity-60" : ""
              }`}
            >
              <input
                type="radio"
                name="priceRange"
                checked={value.priceRange === option.value}
                onChange={() => onChange({ priceRange: option.value })}
                disabled={!isNormalSaleType}
                className="border-border-control bg-bg-app accent-focus-ring h-4 w-4"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="요청사항">
        <div className="w-full max-w-180">
          <div className="relative">
            <FormTextArea
              value={value.cateringDetail}
              onChange={(event) => {
                const next = event.target.value;
                if (next.length > CATERING_DETAIL_LIMIT.max) {
                  setIsCateringMaxExceeded(true);
                  return;
                }

                setIsCateringMaxExceeded(false);
                onChange({ cateringDetail: next });
              }}
              onBlur={() => setIsCateringTouched(true)}
              placeholder={
                isCateringSaleType
                  ? "케이터링 상세 요청사항"
                  : "케이터링 선택 시 입력 가능합니다."
              }
              disabled={!isCateringSaleType}
              className="min-h-24 resize-y pr-20 pb-7 disabled:cursor-not-allowed disabled:border-border-control/60 disabled:bg-bg-app disabled:text-fg-muted disabled:placeholder:text-fg-muted/80 disabled:opacity-80"
            />
            <span
              className={`pointer-events-none absolute right-3 bottom-2 text-[12px] ${
                showCateringMaxError ? "text-[#ff5c5c]" : "text-fg-muted"
              } ${!isCateringSaleType ? "opacity-60" : ""}`}
            >
              {cateringValidation.length} / {CATERING_DETAIL_LIMIT.max}
            </span>
          </div>
          {showCateringMaxError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMaxLengthMessage(CATERING_DETAIL_LIMIT.max)}
            </p>
          ) : null}
          {!showCateringMaxError && showCateringMinError ? (
            <p className="mt-1 text-[12px] text-[#ff5c5c]">
              {getMinLengthMessage(CATERING_DETAIL_LIMIT.min)}
            </p>
          ) : null}
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default EventTargetInfo;
