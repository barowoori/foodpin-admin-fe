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

type UseEventSectionUpdateParams = {
  eventId: string | undefined;
  baseInfoForm: BaseInfoFormState;
  eventRecruitForm: EventRecruitFormState;
  eventTargetForm: EventTargetFormState;
  eventDetailForm: EventDetailFormState;
};

const REQUIRED_VALIDATION_MESSAGE = "필수 사항을 입력해주세요.";
const DETAIL_TEXT_MIN_LENGTH = 10;
const DETAIL_TEXT_MAX_LENGTH = 10000;

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

    const description = eventDetailForm.description.trim();
    const guidelines = eventDetailForm.guidelines.trim();
    const contact = eventDetailForm.contact.trim();

    if (!description || !guidelines || !contact) {
      alert(REQUIRED_VALIDATION_MESSAGE);
      return;
    }

    if (
      description.length < DETAIL_TEXT_MIN_LENGTH ||
      description.length > DETAIL_TEXT_MAX_LENGTH
    ) {
      alert(
        `상세설명은 ${DETAIL_TEXT_MIN_LENGTH}자 이상 ${DETAIL_TEXT_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
      return;
    }

    if (
      guidelines.length < DETAIL_TEXT_MIN_LENGTH ||
      guidelines.length > DETAIL_TEXT_MAX_LENGTH
    ) {
      alert(
        `유의사항은 ${DETAIL_TEXT_MIN_LENGTH}자 이상 ${DETAIL_TEXT_MAX_LENGTH}자 이하로 입력해주세요.`,
      );
      return;
    }

    const payload: UpdateEventDetailPayload = {
      description,
      guidelines,
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
