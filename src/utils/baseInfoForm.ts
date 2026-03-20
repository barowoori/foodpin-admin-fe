import type {
  BaseInfoFormState,
  EventDateTime,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
} from "../types";
import { getIsoDateRange } from "./dateRange";

export const INITIAL_EVENT_FORM_BASE_INFO: BaseInfoFormState = {
  name: "",
  type: "",
  expectedParticipants: "UNDECIDED",
  fileIdList: [],
  photoFiles: [],
  regionDo: "",
  regionSi: "",
  recruitmentUrl: "",
  eventDateMode: "DATE",
  selectedDates: [],
  periodStartDate: "",
  periodEndDate: "",
  applyTimeToAll: false,
  periodTimeByDate: {},
};

export const INITIAL_EVENT_FORM_RECRUIT: EventRecruitFormState = {
  recruitEndDateTime: "",
  recruitCount: 0,
  isFullAttendanceRequired: true,
  isRecruitEndOnSelection: true,
};

export const INITIAL_EVENT_FORM_TARGET: EventTargetFormState = {
  truckTypes: [],
  eventCategoryCodeList: [],
  saleType: "NORMAL",
  priceRange: "UNDER_7000",
  cateringDetail: "",
};

export const INITIAL_EVENT_FORM_DETAIL: EventDetailFormState = {
  description: "",
  guidelines: "",
  contact: "",
  electricitySupportAvailability: true,
  generatorRequirement: true,
};

function createEmptyTimeSlot(): EventDateTime {
  return {
    startTime: "",
    endTime: "",
  };
}

export function applyBaseInfoPatch(
  prev: BaseInfoFormState,
  patch: Partial<BaseInfoFormState>,
): BaseInfoFormState {
  const next: BaseInfoFormState = { ...prev, ...patch };
  const isDateInputUpdated =
    Array.isArray(patch.selectedDates) && patch.selectedDates.length > 0;
  const isPeriodInputUpdated =
    (typeof patch.periodStartDate === "string" &&
      patch.periodStartDate.length > 0) ||
    (typeof patch.periodEndDate === "string" && patch.periodEndDate.length > 0);

  if (isDateInputUpdated) {
    next.periodStartDate = "";
    next.periodEndDate = "";
    next.applyTimeToAll = false;
    next.periodTimeByDate = {};
  }

  if (isPeriodInputUpdated) {
    next.selectedDates = [];
  }

  if (
    typeof patch.periodStartDate === "string" &&
    next.periodEndDate &&
    patch.periodStartDate > next.periodEndDate
  ) {
    next.periodEndDate = "";
  }

  const periodDates = getIsoDateRange(next.periodStartDate, next.periodEndDate);
  const normalizedTimeByDate: Record<string, EventDateTime> = {};

  periodDates.forEach((date) => {
    normalizedTimeByDate[date] = next.periodTimeByDate[date] ?? createEmptyTimeSlot();
  });

  next.periodTimeByDate = normalizedTimeByDate;

  if (patch.applyTimeToAll && periodDates.length > 0) {
    const firstDate = periodDates[0];
    const firstTime = next.periodTimeByDate[firstDate] ?? createEmptyTimeSlot();

    periodDates.forEach((date) => {
      next.periodTimeByDate[date] = { ...firstTime };
    });
  }

  if (
    patch.applyTimeToAll === false &&
    prev.applyTimeToAll &&
    periodDates.length > 0
  ) {
    const clearedTimeByDate: Record<string, EventDateTime> = {};
    periodDates.forEach((date) => {
      clearedTimeByDate[date] = createEmptyTimeSlot();
    });
    next.periodTimeByDate = clearedTimeByDate;
  }

  return next;
}

export function applyPeriodTimeChange(
  prev: BaseInfoFormState,
  date: string,
  key: keyof EventDateTime,
  value: string,
): BaseInfoFormState {
  const nextTimeByDate = { ...prev.periodTimeByDate };
  const current = nextTimeByDate[date] ?? createEmptyTimeSlot();
  nextTimeByDate[date] = { ...current, [key]: value };

  if (prev.applyTimeToAll) {
    Object.keys(nextTimeByDate).forEach((targetDate) => {
      nextTimeByDate[targetDate] = {
        ...nextTimeByDate[targetDate],
        [key]: value,
      };
    });
  }

  return {
    ...prev,
    periodTimeByDate: nextTimeByDate,
  };
}
