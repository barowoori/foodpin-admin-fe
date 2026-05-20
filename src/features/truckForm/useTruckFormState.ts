import { useCallback, useState } from "react";
import type {
  TruckBasicInfoFormState,
  TruckDetailData,
  TruckDocumentFormState,
  TruckMenuFormItem,
  TruckMenuFormState,
  TruckOperationFormState,
  TruckOwnerFormState,
  TruckPaymentFormState,
} from "../../types";
import {
  INITIAL_TRUCK_FORM_STATE,
  createEmptyTruckMenuFormItem,
  mapDetailToTruckFormState,
} from "./formModel";

export function useTruckFormState() {
  const [ownerForm, setOwnerForm] = useState<TruckOwnerFormState>(
    INITIAL_TRUCK_FORM_STATE.ownerForm,
  );
  const [basicInfoForm, setBasicInfoForm] = useState<TruckBasicInfoFormState>(
    INITIAL_TRUCK_FORM_STATE.basicInfoForm,
  );
  const [operationForm, setOperationForm] = useState<TruckOperationFormState>(
    INITIAL_TRUCK_FORM_STATE.operationForm,
  );
  const [menuForm, setMenuForm] = useState<TruckMenuFormState>(
    INITIAL_TRUCK_FORM_STATE.menuForm,
  );
  const [paymentForm, setPaymentForm] = useState<TruckPaymentFormState>(
    INITIAL_TRUCK_FORM_STATE.paymentForm,
  );
  const [documentForm, setDocumentForm] = useState<TruckDocumentFormState>(
    INITIAL_TRUCK_FORM_STATE.documentForm,
  );

  const handleOwnerChange = useCallback((patch: Partial<TruckOwnerFormState>) => {
    setOwnerForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleBasicInfoChange = useCallback(
    (patch: Partial<TruckBasicInfoFormState>) => {
      setBasicInfoForm((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleOperationChange = useCallback(
    (patch: Partial<TruckOperationFormState>) => {
      setOperationForm((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleMenuChange = useCallback((patch: Partial<TruckMenuFormState>) => {
    setMenuForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleMenuItemChange = useCallback(
    (localId: string, patch: Partial<TruckMenuFormItem>) => {
      setMenuForm((prev) => ({
        ...prev,
        truckMenuDtoList: prev.truckMenuDtoList.map((menu) =>
          menu.localId === localId ? { ...menu, ...patch } : menu,
        ),
      }));
    },
    [],
  );

  const handleAddMenuItem = useCallback(() => {
    setMenuForm((prev) => ({
      ...prev,
      truckMenuDtoList: [...prev.truckMenuDtoList, createEmptyTruckMenuFormItem()],
    }));
  }, []);

  const handleRemoveMenuItem = useCallback((localId: string) => {
    setMenuForm((prev) => ({
      ...prev,
      truckMenuDtoList:
        prev.truckMenuDtoList.length === 1
          ? [createEmptyTruckMenuFormItem()]
          : prev.truckMenuDtoList.filter((menu) => menu.localId !== localId),
    }));
  }, []);

  const handlePaymentChange = useCallback(
    (patch: Partial<TruckPaymentFormState>) => {
      setPaymentForm((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const handleDocumentChange = useCallback(
    (patch: Partial<TruckDocumentFormState>) => {
      setDocumentForm((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const hydrateFromDetail = useCallback((detail: TruckDetailData) => {
    const nextState = mapDetailToTruckFormState(detail);
    setOwnerForm(nextState.ownerForm);
    setBasicInfoForm(nextState.basicInfoForm);
    setOperationForm(nextState.operationForm);
    setMenuForm(nextState.menuForm);
    setPaymentForm(nextState.paymentForm);
    setDocumentForm(nextState.documentForm);
  }, []);

  return {
    ownerForm,
    basicInfoForm,
    operationForm,
    menuForm,
    paymentForm,
    documentForm,
    handleOwnerChange,
    handleBasicInfoChange,
    handleOperationChange,
    handleMenuChange,
    handleMenuItemChange,
    handleAddMenuItem,
    handleRemoveMenuItem,
    handlePaymentChange,
    handleDocumentChange,
    hydrateFromDetail,
  };
}
