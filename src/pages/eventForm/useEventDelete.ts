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
      return;
    }

    const isConfirmed = confirm("행사를 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }

    try {
      await mutateDeleteEvent(eventId);
      alert("행사가 삭제되었습니다.");
      navigate("/events");
    } catch (error) {
      console.error("Failed to delete event", error);
      alert("행사 삭제에 실패했습니다.");
    }
  }, [eventId, mutateDeleteEvent, navigate]);

  return {
    isDeletePending,
    handleDelete,
  };
}
