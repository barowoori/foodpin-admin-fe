import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getTruckDetail } from "../../apis";
import type { TruckDetailData } from "../../types";

type UseTruckDetailHydrationParams = {
  hydrateFromDetail: (detail: TruckDetailData) => void;
};

export function useTruckDetailHydration({
  hydrateFromDetail,
}: UseTruckDetailHydrationParams) {
  const { truckId } = useParams<{ truckId: string }>();
  const isDetailMode = Boolean(truckId);

  const { data: truckDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["truck-detail", truckId],
    queryFn: () => getTruckDetail(truckId as string),
    enabled: isDetailMode,
  });

  useEffect(() => {
    if (!truckDetail) {
      return;
    }

    queueMicrotask(() => {
      hydrateFromDetail(truckDetail);
    });
  }, [hydrateFromDetail, truckDetail]);

  return {
    truckId,
    truckDetail,
    isDetailMode,
    isDetailLoading,
  };
}
