import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createEvent } from "../../apis";
import type {
  BaseInfoFormState,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
} from "../../types";
import { buildCreateEventRequestBody } from "./formModel";

type UseEventFormSubmitParams = {
  baseInfoForm: BaseInfoFormState;
  eventRecruitForm: EventRecruitFormState;
  eventTargetForm: EventTargetFormState;
  eventDetailForm: EventDetailFormState;
};

export function useEventFormSubmit({
  baseInfoForm,
  eventRecruitForm,
  eventTargetForm,
  eventDetailForm,
}: UseEventFormSubmitParams) {
  const navigate = useNavigate();

  const { mutateAsync: mutateCreateEvent, isPending } = useMutation({
    mutationFn: createEvent,
  });

  const handleSubmit = useCallback(async () => {
    const { requestBody, errorMessage } = buildCreateEventRequestBody({
      baseInfoForm,
      eventRecruitForm,
      eventTargetForm,
      eventDetailForm,
    });

    if (!requestBody) {
      alert(errorMessage);
      return;
    }

    try {
      await mutateCreateEvent(requestBody);
      navigate("/events");
    } catch (error) {
      console.error("Failed to create event", error);
      alert("행사 등록에 실패했습니다.");
    }
  }, [
    baseInfoForm,
    eventRecruitForm,
    eventTargetForm,
    eventDetailForm,
    mutateCreateEvent,
    navigate,
  ]);

  return {
    isPending,
    handleSubmit,
  };
}
