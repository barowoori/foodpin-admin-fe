import type { SaleType } from "../../types";

export const EVENT_NAME_LIMIT = { min: 1, max: 30 } as const;
export const CATERING_DETAIL_LIMIT = { min: 10, max: 10000 } as const;
export const DESCRIPTION_LIMIT = { min: 10, max: 10000 } as const;
export const GUIDELINES_LIMIT = { min: 10, max: 10000 } as const;

type TextLengthLimit = {
  min: number;
  max: number;
};

export type TextLengthValidation = {
  length: number;
  isUnderMin: boolean;
  isOverMax: boolean;
  isValid: boolean;
};

export function getMinLengthMessage(min: number) {
  return `최소 ${min}자 이상 입력해 주세요.`;
}

export function getMaxLengthMessage(max: number) {
  return `최대 ${max}자를 초과할 수 없습니다.`;
}

export function validateTextLength(
  value: string,
  limit: TextLengthLimit,
): TextLengthValidation {
  const length = value.length;
  const isUnderMin = length < limit.min;
  const isOverMax = length > limit.max;

  return {
    length,
    isUnderMin,
    isOverMax,
    isValid: !isUnderMin && !isOverMax,
  };
}

export function isCreateEventTextLengthValid(params: {
  name: string;
  saleType: SaleType;
  cateringDetail: string;
  description: string;
  guidelines: string;
}) {
  const nameValidation = validateTextLength(params.name, EVENT_NAME_LIMIT);
  const descriptionValidation = validateTextLength(
    params.description,
    DESCRIPTION_LIMIT,
  );
  const guidelinesValidation = validateTextLength(
    params.guidelines,
    GUIDELINES_LIMIT,
  );

  if (
    !nameValidation.isValid ||
    !descriptionValidation.isValid ||
    !guidelinesValidation.isValid
  ) {
    return false;
  }

  if (params.saleType !== "CATERING") {
    return true;
  }

  const cateringValidation = validateTextLength(
    params.cateringDetail,
    CATERING_DETAIL_LIMIT,
  );
  return cateringValidation.isValid;
}

