import type { EventDetailResponse } from "../../apis";
import type {
  BaseInfoFormState,
  EventCreateRequestBody,
  EventDateRequestDto,
  EventDateTime,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
  EventType,
  ExpectedParticipants,
  PriceRange,
  SaleType,
  TruckType,
} from "../../types";
import {
  getIsoDateRange,
  getRegionSiOptions,
  INITIAL_EVENT_FORM_BASE_INFO,
  INITIAL_EVENT_FORM_DETAIL,
  INITIAL_EVENT_FORM_RECRUIT,
  INITIAL_EVENT_FORM_TARGET,
  REGION_DO_OPTIONS,
} from "../../utils";
import {
  CATERING_DETAIL_LIMIT,
  DESCRIPTION_LIMIT,
  EVENT_NAME_LIMIT,
  GUIDELINES_LIMIT,
  getMaxLengthMessage,
  getMinLengthMessage,
  validateTextLength,
} from "./textLengthValidation";

const EVENT_TYPES: EventType[] = [
  "CORPORATE",
  "PERSONAL",
  "SCHOOL",
  "LOCAL",
  "APARTMENT_MARKET",
  "CELEBRITY_SUPPORT",
];

const EXPECTED_PARTICIPANTS: ExpectedParticipants[] = [
  "UNDECIDED",
  "UNDER_50",
  "UNDER_100",
  "UNDER_150",
  "UNDER_200",
  "OVER_200",
];

const TRUCK_TYPES: TruckType[] = ["SNACK", "MEAL", "STREET_FOOD", "COFFEE"];
const SALE_TYPES: SaleType[] = ["NORMAL", "CATERING"];
const PRICE_RANGES: PriceRange[] = [
  "UNDER_7000",
  "UNDER_8000",
  "UNDER_9000",
  "UNDER_10000",
  "NO_MATTER",
];

const EVENT_CATEGORY_CODE_MAP: Record<string, string> = {
  KOREAN: "C01",
  WESTERN: "C02",
  JAPANESE: "C03",
  CHINESE: "C04",
  SNACK: "C05",
  WORLD: "C06",
  ETC: "C07",
  C01: "C01",
  C02: "C02",
  C03: "C03",
  C04: "C04",
  C05: "C05",
  C06: "C06",
  C07: "C07",
};

const REQUIRED_VALIDATION_MESSAGE = "필수 사항을 입력해주세요.";

export type EventDetailData = NonNullable<EventDetailResponse["data"]>;

export type EventFormStateBundle = {
  baseInfoForm: BaseInfoFormState;
  eventRecruitForm: EventRecruitFormState;
  eventTargetForm: EventTargetFormState;
  eventDetailForm: EventDetailFormState;
};

type BuildCreateEventRequestBodyParams = EventFormStateBundle;

export type BuildCreateEventRequestBodyResult =
  | {
      requestBody: EventCreateRequestBody;
      errorMessage?: never;
    }
  | {
      requestBody: null;
      errorMessage: string;
    };

function normalizeEventCategoryCode(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return "";
  }

  if (/^C\d{2}$/.test(normalized)) {
    return normalized;
  }

  return EVENT_CATEGORY_CODE_MAP[normalized] ?? normalized;
}

export function normalizeEventCategoryCodes(codes: string[]) {
  return [...new Set(codes.map(normalizeEventCategoryCode).filter(Boolean))];
}

function normalizeTimeValue(value: string) {
  if (!value) {
    return "00:00:00";
  }

  return value.length === 5 ? `${value}:00` : value;
}

function toIsoDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function toDateTimeLocalValue(value: string) {
  if (!value) {
    return "";
  }

  if (value.length >= 16 && value.includes("T")) {
    return value.slice(0, 16);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const offsetMinutes = parsed.getTimezoneOffset();
  const localDate = new Date(parsed.getTime() - offsetMinutes * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function toTimeInputValue(value: string) {
  if (!value) {
    return "";
  }

  if (value.length >= 5) {
    return value.slice(0, 5);
  }

  return "";
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && allowed.includes(value as T);
}

function resolveRegionSelection(regionCode: string) {
  if (!regionCode) {
    return { regionDo: "", regionSi: "" };
  }

  if (regionCode.startsWith("DO")) {
    return { regionDo: regionCode, regionSi: "" };
  }

  for (const regionDo of REGION_DO_OPTIONS) {
    if (!regionDo.value) {
      continue;
    }

    const regionSiOptions = getRegionSiOptions(regionDo.value);
    if (regionSiOptions.some((option) => option.value === regionCode)) {
      return { regionDo: regionDo.value, regionSi: regionCode };
    }
  }

  return { regionDo: "", regionSi: "" };
}

function isContinuousDates(dates: string[]) {
  if (dates.length <= 1) {
    return false;
  }

  for (let i = 1; i < dates.length; i += 1) {
    const prev = new Date(`${dates[i - 1]}T00:00:00`);
    const current = new Date(`${dates[i]}T00:00:00`);
    const diffDays = (current.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);

    if (diffDays !== 1) {
      return false;
    }
  }

  return true;
}

function mapDetailToBaseInfo(detail: EventDetailData): BaseInfoFormState {
  const regionCode =
    detail.regions?.find((region) => typeof region?.code === "string")?.code ?? "";
  const { regionDo, regionSi } = resolveRegionSelection(regionCode);

  const dateEntries = Array.isArray(detail.dates)
    ? detail.dates.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry?.date))
    : [];

  const sortedDates = [...new Set(dateEntries.map((entry) => entry.date as string))].sort(
    (a, b) => (a < b ? -1 : a > b ? 1 : 0),
  );

  const periodTimeByDate: Record<string, EventDateTime> = {};
  dateEntries.forEach((entry) => {
    if (!entry.date) {
      return;
    }

    periodTimeByDate[entry.date] = {
      startTime: toTimeInputValue(entry.startTime ?? ""),
      endTime: toTimeInputValue(entry.endTime ?? ""),
    };
  });

  const usePeriodMode = isContinuousDates(sortedDates);

  return {
    ...INITIAL_EVENT_FORM_BASE_INFO,
    name: detail.name ?? "",
    type: isOneOf(detail.type, EVENT_TYPES) ? detail.type : "",
    expectedParticipants: isOneOf(detail.expectedParticipants, EXPECTED_PARTICIPANTS)
      ? detail.expectedParticipants
      : INITIAL_EVENT_FORM_BASE_INFO.expectedParticipants,
    fileIdList:
      detail.photos
        ?.map((photo) => photo?.id)
        .filter((id): id is string => typeof id === "string") ?? [],
    photoFiles: [],
    photoPaths:
      detail.photos
        ?.map((photo) => photo?.path)
        .filter((path): path is string => typeof path === "string") ?? [],
    regionDo,
    regionSi,
    recruitmentUrl: detail.recruitmentUrl ?? "",
    eventDateMode: usePeriodMode ? "PERIOD" : "DATE",
    selectedDates: usePeriodMode ? [] : sortedDates,
    periodStartDate: usePeriodMode ? sortedDates[0] ?? "" : "",
    periodEndDate: usePeriodMode ? sortedDates[sortedDates.length - 1] ?? "" : "",
    applyTimeToAll: false,
    periodTimeByDate: usePeriodMode ? periodTimeByDate : {},
  };
}

function mapDetailToRecruit(detail: EventDetailData): EventRecruitFormState {
  return {
    recruitEndDateTime: toDateTimeLocalValue(detail.recruitEndDateTime ?? ""),
    recruitCount: Math.max(0, detail.recruitInfo?.recruitCount ?? 0),
    isFullAttendanceRequired: detail.isFullAttendanceRequired ?? true,
    isRecruitEndOnSelection:
      detail.isRecruitEndOnSelection ?? detail.recruitInfo?.isRecruitEndOnSelection ?? true,
  };
}

function mapDetailToTarget(detail: EventDetailData): EventTargetFormState {
  const saleType = isOneOf(detail.saleType, SALE_TYPES) ? detail.saleType : "NORMAL";

  return {
    truckTypes:
      detail.truckTypes?.filter((truckType): truckType is TruckType =>
        isOneOf(truckType, TRUCK_TYPES),
      ) ?? [],
    eventCategoryCodeList:
      detail.categories
        ?.map((category) => category?.code)
        .filter((code): code is string => typeof code === "string") ?? [],
    saleType,
    priceRange:
      saleType === "NORMAL" && isOneOf(detail.priceRange, PRICE_RANGES)
        ? detail.priceRange
        : "",
    cateringDetail: detail.cateringDetail ?? "",
  };
}

function mapDetailToDetailForm(detail: EventDetailData): EventDetailFormState {
  return {
    description: detail.description ?? "",
    guidelines: detail.guidelines ?? "",
    contact: detail.contact ?? "",
    electricitySupportAvailability:
      typeof detail.electricitySupportAvailability === "boolean"
        ? detail.electricitySupportAvailability
        : null,
    generatorRequirement: detail.generatorRequirement ?? true,
  };
}

export function mapDetailToEventFormState(detail: EventDetailData): EventFormStateBundle {
  return {
    baseInfoForm: mapDetailToBaseInfo(detail),
    eventRecruitForm: mapDetailToRecruit(detail),
    eventTargetForm: mapDetailToTarget(detail),
    eventDetailForm: mapDetailToDetailForm(detail),
  };
}

export function buildEventDateDtoList(baseInfoForm: BaseInfoFormState): EventDateRequestDto[] {
  if (baseInfoForm.eventDateMode === "PERIOD") {
    const dates = getIsoDateRange(baseInfoForm.periodStartDate, baseInfoForm.periodEndDate);

    return dates.map((date) => {
      const time = baseInfoForm.periodTimeByDate[date];

      return {
        date,
        startTime: normalizeTimeValue(time?.startTime ?? ""),
        endTime: normalizeTimeValue(time?.endTime ?? ""),
      };
    });
  }

  return baseInfoForm.selectedDates.map((date) => ({
    date,
    startTime: "00:00:00",
    endTime: "00:00:00",
  }));
}

export function buildCreateEventRequestBody({
  baseInfoForm,
  eventRecruitForm,
  eventTargetForm,
  eventDetailForm,
}: BuildCreateEventRequestBodyParams): BuildCreateEventRequestBodyResult {
  const fail = (message = REQUIRED_VALIDATION_MESSAGE): BuildCreateEventRequestBodyResult => ({
    requestBody: null,
    errorMessage: message,
  });

  if (!baseInfoForm.name.trim()) {
    return fail();
  }

  const nameLengthValidation = validateTextLength(baseInfoForm.name, EVENT_NAME_LIMIT);
  if (nameLengthValidation.isUnderMin) {
    return fail(getMinLengthMessage(EVENT_NAME_LIMIT.min));
  }
  if (nameLengthValidation.isOverMax) {
    return fail(getMaxLengthMessage(EVENT_NAME_LIMIT.max));
  }

  if (!baseInfoForm.type) {
    return fail();
  }

  const regionCode = baseInfoForm.regionSi || baseInfoForm.regionDo;
  if (!regionCode) {
    return fail();
  }

  const recruitmentUrl = baseInfoForm.recruitmentUrl.trim();
  if (!recruitmentUrl) {
    return fail();
  }

  const eventDateDtoList = buildEventDateDtoList(baseInfoForm);
  if (eventDateDtoList.length === 0) {
    return fail();
  }

  if (eventTargetForm.truckTypes.length === 0) {
    return fail();
  }

  if (eventTargetForm.eventCategoryCodeList.length === 0) {
    return fail();
  }

  if (!eventDetailForm.description.trim()) {
    return fail();
  }

  if (!eventDetailForm.guidelines.trim()) {
    return fail();
  }

  if (!eventDetailForm.contact.trim()) {
    return fail();
  }

  const descriptionLengthValidation = validateTextLength(
    eventDetailForm.description,
    DESCRIPTION_LIMIT,
  );
  if (descriptionLengthValidation.isUnderMin) {
    return fail(getMinLengthMessage(DESCRIPTION_LIMIT.min));
  }
  if (descriptionLengthValidation.isOverMax) {
    return fail(getMaxLengthMessage(DESCRIPTION_LIMIT.max));
  }

  const guidelinesLengthValidation = validateTextLength(
    eventDetailForm.guidelines,
    GUIDELINES_LIMIT,
  );
  if (guidelinesLengthValidation.isUnderMin) {
    return fail(getMinLengthMessage(GUIDELINES_LIMIT.min));
  }
  if (guidelinesLengthValidation.isOverMax) {
    return fail(getMaxLengthMessage(GUIDELINES_LIMIT.max));
  }

  if (!eventRecruitForm.recruitEndDateTime) {
    return fail();
  }

  const recruitEndDateTimeIso = toIsoDateTime(eventRecruitForm.recruitEndDateTime);
  if (!recruitEndDateTimeIso) {
    return fail();
  }

  const trimmedCateringDetail = eventTargetForm.cateringDetail.trim();
  if (eventTargetForm.saleType === "CATERING") {
    if (!trimmedCateringDetail) {
      return fail();
    }

    const cateringLengthValidation = validateTextLength(
      eventTargetForm.cateringDetail,
      CATERING_DETAIL_LIMIT,
    );
    if (cateringLengthValidation.isUnderMin) {
      return fail(getMinLengthMessage(CATERING_DETAIL_LIMIT.min));
    }
    if (cateringLengthValidation.isOverMax) {
      return fail(getMaxLengthMessage(CATERING_DETAIL_LIMIT.max));
    }
  }

  return {
    requestBody: {
      eventInfoDto: {
        name: baseInfoForm.name.trim(),
        type: baseInfoForm.type as EventType,
        expectedParticipants: baseInfoForm.expectedParticipants,
        fileIdList: baseInfoForm.fileIdList,
        regionCode,
        eventDateDtoList,
        recruitmentUrl,
      },
      eventRecruitDto: {
        recruitEndDateTime: recruitEndDateTimeIso,
        recruitCount: Math.max(0, eventRecruitForm.recruitCount),
        isFullAttendanceRequired: eventRecruitForm.isFullAttendanceRequired,
        isRecruitEndOnSelection: eventRecruitForm.isRecruitEndOnSelection,
      },
      eventTargetDto: {
        truckTypes: eventTargetForm.truckTypes,
        eventCategoryCodeList: normalizeEventCategoryCodes(
          eventTargetForm.eventCategoryCodeList,
        ),
        saleType: eventTargetForm.saleType,
        ...(eventTargetForm.saleType === "NORMAL" && eventTargetForm.priceRange
          ? { priceRange: eventTargetForm.priceRange }
          : {}),
        ...(eventTargetForm.saleType === "CATERING" && trimmedCateringDetail
          ? { cateringDetail: trimmedCateringDetail }
          : {}),
      },
      eventDetailDto: {
        description: eventDetailForm.description.trim(),
        guidelines: eventDetailForm.guidelines.trim(),
        contact: eventDetailForm.contact.trim(),
        electricitySupportAvailability: eventDetailForm.electricitySupportAvailability,
        generatorRequirement: eventDetailForm.generatorRequirement,
      },
    },
  };
}

export function createInitialEventFormState(): EventFormStateBundle {
  return {
    baseInfoForm: INITIAL_EVENT_FORM_BASE_INFO,
    eventRecruitForm: INITIAL_EVENT_FORM_RECRUIT,
    eventTargetForm: INITIAL_EVENT_FORM_TARGET,
    eventDetailForm: INITIAL_EVENT_FORM_DETAIL,
  };
}
