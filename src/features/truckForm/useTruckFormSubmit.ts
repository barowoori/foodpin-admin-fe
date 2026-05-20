import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createTruck, updateTruck } from "../../apis";
import type { TruckFormStateBundle } from "../../types";
import {
  buildCreateTruckRequestBody,
  buildUpdateTruckRequestBody,
} from "./formModel";

type UseTruckFormSubmitParams = {
  truckId?: string;
  isDetailMode: boolean;
  formState: TruckFormStateBundle;
};

export function useTruckFormSubmit({
  truckId,
  isDetailMode,
  formState,
}: UseTruckFormSubmitParams) {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createTruck,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateTruck>[1]) => {
      if (!truckId) {
        throw new Error("truckId is required");
      }

      return updateTruck(truckId, payload);
    },
  });

  const handleSubmit = useCallback(async () => {
    if (isDetailMode) {
      const { requestBody, errorMessage } = buildUpdateTruckRequestBody(formState);

      if (!requestBody) {
        alert(errorMessage);
        return;
      }

      try {
        await updateMutation.mutateAsync(requestBody);
        alert("푸드트럭 정보가 수정되었습니다.");
        navigate("/trucks");
      } catch (error) {
        console.error("Failed to update truck", error);
        alert("푸드트럭 수정에 실패했습니다.");
      }

      return;
    }

    const { requestBody, errorMessage } = buildCreateTruckRequestBody(formState);

    if (!requestBody) {
      alert(errorMessage);
      return;
    }

    try {
      await createMutation.mutateAsync(requestBody);
      navigate("/trucks");
    } catch (error) {
      console.error("Failed to create truck", error);
      alert("푸드트럭 등록에 실패했습니다.");
    }
  }, [
    createMutation,
    formState,
    isDetailMode,
    navigate,
    updateMutation,
  ]);

  return {
    isPending: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
}
