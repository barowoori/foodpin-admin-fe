import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getEventDetail } from "../../apis";
import type { EventDetailData } from "./formModel";

type UseEventDetailHydrationParams = {
  hydrateFromDetail: (detail: EventDetailData) => void;
};

export function useEventDetailHydration({
  hydrateFromDetail,
}: UseEventDetailHydrationParams) {
  const { eventId } = useParams<{ eventId: string }>();
  const isDetailMode = Boolean(eventId);

  const { data: eventDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["event-detail", eventId],
    queryFn: () => getEventDetail(eventId as string),
    enabled: isDetailMode,
  });

  useEffect(() => {
    if (!eventDetail) {
      return;
    }

    queueMicrotask(() => {
      hydrateFromDetail(eventDetail);
    });
  }, [eventDetail, hydrateFromDetail]);

  return {
    eventId,
    isDetailMode,
    isDetailLoading,
  };
}
