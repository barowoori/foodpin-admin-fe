import { useCallback, useState } from "react";
import type {
  BaseInfoFormState,
  EventDateTime,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
} from "../../types";
import { applyBaseInfoPatch, applyPeriodTimeChange } from "../../utils";
import {
  createInitialEventFormState,
  mapDetailToEventFormState,
  type EventDetailData,
} from "./formModel";

export function useEventFormState() {
  const initialState = createInitialEventFormState();
  const [baseInfoForm, setBaseInfoForm] = useState<BaseInfoFormState>(initialState.baseInfoForm);
  const [eventRecruitForm, setEventRecruitForm] = useState<EventRecruitFormState>(
    initialState.eventRecruitForm,
  );
  const [eventTargetForm, setEventTargetForm] = useState<EventTargetFormState>(
    initialState.eventTargetForm,
  );
  const [eventDetailForm, setEventDetailForm] = useState<EventDetailFormState>(
    initialState.eventDetailForm,
  );

  const handleBaseInfoChange = useCallback((patch: Partial<BaseInfoFormState>) => {
    setBaseInfoForm((prev) => applyBaseInfoPatch(prev, patch));
  }, []);

  const handlePeriodTimeChange = useCallback((date: string, key: keyof EventDateTime, value: string) => {
    setBaseInfoForm((prev) => applyPeriodTimeChange(prev, date, key, value));
  }, []);

  const handleRecruitInfoChange = useCallback((patch: Partial<EventRecruitFormState>) => {
    setEventRecruitForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleTargetInfoChange = useCallback((patch: Partial<EventTargetFormState>) => {
    setEventTargetForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleDetailInfoChange = useCallback((patch: Partial<EventDetailFormState>) => {
    setEventDetailForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const hydrateFromDetail = useCallback((detail: EventDetailData) => {
    const mappedState = mapDetailToEventFormState(detail);
    setBaseInfoForm(mappedState.baseInfoForm);
    setEventRecruitForm(mappedState.eventRecruitForm);
    setEventTargetForm(mappedState.eventTargetForm);
    setEventDetailForm(mappedState.eventDetailForm);
  }, []);

  return {
    baseInfoForm,
    eventRecruitForm,
    eventTargetForm,
    eventDetailForm,
    handleBaseInfoChange,
    handlePeriodTimeChange,
    handleRecruitInfoChange,
    handleTargetInfoChange,
    handleDetailInfoChange,
    hydrateFromDetail,
  };
}
