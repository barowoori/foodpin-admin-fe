import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { deleteEvent } from "../../apis";

type UseEventDeleteParams = {
  eventId: string | undefined;
};

export function useEventDelete({ eventId }: UseEventDeleteParams) {
  const navigate = useNavigate();

  const { mutateAsync: mutateDeleteEvent, isPending: isDeletePending } = useMutation({
    mutationFn: deleteEvent,
  });

  const handleDelete = useCallback(async () => {
    if (!eventId) {
      return false;
    }

    try {
      await mutateDeleteEvent(eventId);
      alert("행사가 삭제되었습니다.");
      navigate("/events");
      return true;
    } catch (error) {
      console.error("Failed to delete event", error);
      alert("행사 삭제에 실패했습니다.");
      return false;
    }
  }, [eventId, mutateDeleteEvent, navigate]);

  return {
    isDeletePending,
    handleDelete,
  };
}
