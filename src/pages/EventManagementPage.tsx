import { useMemo, useState } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getEventDetail, getEvents, updateEventHidden } from "../apis";
import { Button, EventManagementContent, PageTitleBar } from "../components";
import { Header } from "../shared";
import type { EventFilterPatch, EventFilterState } from "../types";
import {
  buildEventQueryParams,
  getRegionSiOptions,
  INITIAL_EVENT_FILTERS,
  mapEventTableRows,
  REGION_DO_OPTIONS,
  type EventCalendarState,
} from "../utils";

function EventManagementPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<EventFilterState>(
    INITIAL_EVENT_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] = useState<EventFilterState>(
    INITIAL_EVENT_FILTERS,
  );

  const regionSiOptions = useMemo(
    () => getRegionSiOptions(filters.regionDo),
    [filters.regionDo],
  );

  const eventQueryParams = useMemo(
    () => buildEventQueryParams(appliedFilters),
    [appliedFilters],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["event-list", eventQueryParams],
    queryFn: () => getEvents(eventQueryParams),
  });
  const { mutateAsync: mutateEventHidden } = useMutation({
    mutationFn: updateEventHidden,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["event-list"],
      });
    },
  });

  const eventDetailQueries = useQueries({
    queries: (data?.content ?? []).map((item) => ({
      queryKey: ["event-list-detail", item.id],
      queryFn: () => getEventDetail(item.id),
      enabled: Boolean(item.id),
      staleTime: 60 * 1000,
    })),
  });

  const eventCalendarStateById = useMemo(() => {
    const nextState: Record<string, EventCalendarState | undefined> = {};

    (data?.content ?? []).forEach((item, index) => {
      const query = eventDetailQueries[index];
      nextState[item.id] = {
        isLoading: Boolean(query?.isLoading || query?.isFetching),
        calendarData: query?.data
          ? {
              operatingTime: query.data.operatingTime ?? null,
              dates: (query.data.dates ?? [])
                .filter((entry) => Boolean(entry?.date))
                .map((entry) => ({
                  id: entry?.id,
                  date: entry?.date ?? "",
                  startTime: entry?.startTime ?? null,
                  endTime: entry?.endTime ?? null,
                })),
            }
          : undefined,
      };
    });

    return nextState;
  }, [data?.content, eventDetailQueries]);

  const items = useMemo(
    () =>
      mapEventTableRows(
        data,
        appliedFilters.page,
        appliedFilters.size,
        eventCalendarStateById,
      ),
    [appliedFilters.page, appliedFilters.size, data, eventCalendarStateById],
  );

  const handleFilterPatch = (patch: EventFilterPatch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setFilters(INITIAL_EVENT_FILTERS);
    setAppliedFilters(INITIAL_EVENT_FILTERS);
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 0 }));
    setAppliedFilters({ ...filters, page: 0 });
  };

  const handlePageSizeChange = (nextSize: number) => {
    setFilters((prev) => ({ ...prev, page: 0, size: nextSize }));
    setAppliedFilters((prev) => ({ ...prev, page: 0, size: nextSize }));
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const handleToggleEventHidden = async (
    eventId: string,
    nextIsHidden: boolean,
  ) => {
    await mutateEventHidden({ eventId, isHidden: nextIsHidden });
  };

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto w-full max-w-270 px-2 pt-12 pb-20">
        <PageTitleBar
          title="행사 관리"
          actions={
            <>
              <Button onClick={handleReset}>검색 초기화</Button>
              <Button disabled={isFetching} onClick={handleSearch}>
                조회
              </Button>
            </>
          }
        />

        <EventManagementContent
          filters={filters}
          regionDoOptions={REGION_DO_OPTIONS}
          regionSiOptions={regionSiOptions}
          onFilterPatch={handleFilterPatch}
          onToggleEventHidden={handleToggleEventHidden}
          items={items}
          totalCount={data?.totalElements ?? 0}
          pageSize={appliedFilters.size}
          totalPages={data?.totalPages ?? 0}
          currentPage={data?.page ?? appliedFilters.page}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default EventManagementPage;
