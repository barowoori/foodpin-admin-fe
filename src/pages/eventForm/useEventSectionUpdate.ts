import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  updateEventDetail,
  updateEventInfo,
  updateEventRecruitmentUrl,
  updateEventRecruit,
  updateEventTarget,
  type UpdateEventDetailPayload,
  type UpdateEventInfoPayload,
  type UpdateEventRecruitmentUrlPayload,
  type UpdateEventRecruitPayload,
  type UpdateEventTargetPayload,
} from "../../apis";
import type {
  BaseInfoFormState,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
} from "../../types";
import { buildEventDateDtoList, normalizeEventCategoryCodes } from "./formModel";
import {
  CATERING_DETAIL_LIMIT,
  DESCRIPTION_LIMIT,
  EVENT_NAME_LIMIT,
  GUIDELINES_LIMIT,
  getMaxLengthMessage,
  getMinLengthMessage,
  validateTextLength,
} from "./textLengthValidation";

type UseEventSectionUpdateParams = {
  eventId: string | undefined;
  baseInfoForm: BaseInfoFormState;
  eventRecruitForm: EventRecruitFormState;
  eventTargetForm: EventTargetFormState;
  eventDetailForm: EventDetailFormState;
};

const REQUIRED_VALIDATION_MESSAGE = "필수 사항을 입력해주세요.";

function toIsoDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

export function useEventSectionUpdate({
  eventId,
  baseInfoForm,
  eventRecruitForm,
  eventTargetForm,
  eventDetailForm,
}: UseEventSectionUpdateParams) {
  const infoMutation = useMutation({
    mutationFn: (payload: UpdateEventInfoPayload) => {
      if (!eventId) {
        throw new Error("eventId is required");
      }
      return updateEventInfo(eventId, payload);
    },
  });

  const detailMutation = useMutation({
    mutationFn: (payload: UpdateEventDetailPayload) => {
      if (!eventId) {
        throw new Error("eventId is required");
      }
      return updateEventDetail(eventId, payload);
    },
  });

  const recruitMutation = useMutation({
    mutationFn: (payload: UpdateEventRecruitPayload) => {
      if (!eventId) {
        throw new Error("eventId is required");
      }
      return updateEventRecruit(eventId, payload);
    },
  });

  const targetMutation = useMutation({
    mutationFn: (payload: UpdateEventTargetPayload) => {
      if (!eventId) {
        throw new Error("eventId is required");
      }
      return updateEventTarget(eventId, payload);
    },
  });

  const recruitmentUrlMutation = useMutation({
    mutationFn: (payload: UpdateEventRecruitmentUrlPayload) => {
      if (!eventId) {
        throw new Error("eventId is required");
      }
      return updateEventRecruitmentUrl(eventId, payload);
    },
  });

  const handleInfoUpdate = useCallback(async () => {
    if (!eventId) {
      return;
    }

    if (!baseInfoForm.name.trim() || !baseInfoForm.type) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const nameLengthValidation = validateTextLength(baseInfoForm.name, EVENT_NAME_LIMIT);
    if (nameLengthValidation.isUnderMin) {
      alert(getMinLengthMessage(EVENT_NAME_LIMIT.min));
      return;
    }
    if (nameLengthValidation.isOverMax) {
      alert(getMaxLengthMessage(EVENT_NAME_LIMIT.max));
      return;
    }

    const regionCode = baseInfoForm.regionSi || baseInfoForm.regionDo;
    const eventDateDtoList = buildEventDateDtoList(baseInfoForm);
    if (!regionCode || eventDateDtoList.length === 0) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const payload: UpdateEventInfoPayload = {
      name: baseInfoForm.name.trim(),
      type: baseInfoForm.type,
      expectedParticipants: baseInfoForm.expectedParticipants,
      fileIdList: baseInfoForm.fileIdList,
      eventDateDtoList,
      regionCode,
    };

    try {
      await infoMutation.mutateAsync(payload);
      alert("기본정보가 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update event info", error);
      alert("기본정보 수정에 실패했습니다.");
    }
  }, [baseInfoForm, eventId, infoMutation]);

  const handleDetailUpdate = useCallback(async () => {
    if (!eventId) {
      return;
    }

    const description = eventDetailForm.description;
    const guidelines = eventDetailForm.guidelines;
    const contact = eventDetailForm.contact.trim();

    if (!description || !guidelines || !contact) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const descriptionValidation = validateTextLength(description, DESCRIPTION_LIMIT);
    if (descriptionValidation.isUnderMin) {
      alert(getMinLengthMessage(DESCRIPTION_LIMIT.min));
      return;
    }
    if (descriptionValidation.isOverMax) {
      alert(getMaxLengthMessage(DESCRIPTION_LIMIT.max));
      return;
    }

    const guidelinesValidation = validateTextLength(guidelines, GUIDELINES_LIMIT);
    if (guidelinesValidation.isUnderMin) {
      alert(getMinLengthMessage(GUIDELINES_LIMIT.min));
      return;
    }
    if (guidelinesValidation.isOverMax) {
      alert(getMaxLengthMessage(GUIDELINES_LIMIT.max));
      return;
    }

    const payload: UpdateEventDetailPayload = {
      description: description.trim(),
      guidelines: guidelines.trim(),
      contact,
      electricitySupportAvailability: eventDetailForm.electricitySupportAvailability,
      generatorRequirement: eventDetailForm.generatorRequirement,
    };

    try {
      await detailMutation.mutateAsync(payload);
      alert("상세정보가 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update event detail", error);
      alert("상세정보 수정에 실패했습니다.");
    }
  }, [detailMutation, eventDetailForm, eventId]);

  const handleRecruitUpdate = useCallback(async () => {
    if (!eventId) {
      return;
    }

    if (!eventRecruitForm.recruitEndDateTime) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const recruitEndDateTimeIso = toIsoDateTime(eventRecruitForm.recruitEndDateTime);
    if (!recruitEndDateTimeIso) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const payload: UpdateEventRecruitPayload = {
      recruitEndDateTime: recruitEndDateTimeIso,
      recruitCount: Math.max(0, eventRecruitForm.recruitCount),
      isFullAttendanceRequired: eventRecruitForm.isFullAttendanceRequired,
      isRecruitEndOnSelection: eventRecruitForm.isRecruitEndOnSelection,
    };

    try {
      await recruitMutation.mutateAsync(payload);
      alert("모집정보가 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update event recruit", error);
      alert("모집정보 수정에 실패했습니다.");
    }
  }, [eventId, eventRecruitForm, recruitMutation]);

  const handleTargetUpdate = useCallback(async () => {
    if (!eventId) {
      return;
    }

    if (
      eventTargetForm.truckTypes.length === 0 ||
      eventTargetForm.eventCategoryCodeList.length === 0
    ) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    const trimmedCateringDetail = eventTargetForm.cateringDetail.trim();
    if (eventTargetForm.saleType === "CATERING" && !trimmedCateringDetail) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }
    if (eventTargetForm.saleType === "CATERING") {
      const cateringValidation = validateTextLength(
        eventTargetForm.cateringDetail,
        CATERING_DETAIL_LIMIT,
      );
      if (cateringValidation.isUnderMin) {
        alert(getMinLengthMessage(CATERING_DETAIL_LIMIT.min));
        return;
      }
      if (cateringValidation.isOverMax) {
        alert(getMaxLengthMessage(CATERING_DETAIL_LIMIT.max));
        return;
      }
    }

    const payload: UpdateEventTargetPayload = {
      truckTypes: eventTargetForm.truckTypes,
      eventCategoryCodeList: normalizeEventCategoryCodes(
        eventTargetForm.eventCategoryCodeList,
      ),
      saleType: eventTargetForm.saleType,
      ...(eventTargetForm.saleType === "NORMAL" && eventTargetForm.priceRange
        ? { priceRange: eventTargetForm.priceRange }
        : {}),
      ...(eventTargetForm.saleType === "CATERING"
        ? { cateringDetail: trimmedCateringDetail }
        : {}),
    };

    try {
      await targetMutation.mutateAsync(payload);
      alert("운영대상 정보가 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update event target", error);
      alert("운영대상 정보 수정에 실패했습니다.");
    }
  }, [eventId, eventTargetForm, targetMutation]);

  const handleRecruitmentUrlUpdate = useCallback(async () => {
    if (!eventId) {
      return;
    }

    const recruitmentUrl = baseInfoForm.recruitmentUrl.trim();
    if (!recruitmentUrl) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    try {
      await recruitmentUrlMutation.mutateAsync({ recruitmentUrl });
      alert("모집 URL이 수정되었습니다.");
    } catch (error) {
      console.error("Failed to update event recruitment url", error);
      alert("모집 URL 수정에 실패했습니다.");
    }
  }, [baseInfoForm.recruitmentUrl, eventId, recruitmentUrlMutation]);

  return {
    isInfoUpdating: infoMutation.isPending,
    isDetailUpdating: detailMutation.isPending,
    isRecruitUpdating: recruitMutation.isPending,
    isTargetUpdating: targetMutation.isPending,
    isRecruitmentUrlUpdating: recruitmentUrlMutation.isPending,
    handleInfoUpdate,
    handleDetailUpdate,
    handleRecruitUpdate,
    handleTargetUpdate,
    handleRecruitmentUrlUpdate,
  };
}
