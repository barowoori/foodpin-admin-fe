import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../apis";
import { Button, EventManagementContent } from "../components";
import { Header } from "../shared";
import type { EventFilterPatch, EventFilterState } from "../types";
import {
  buildEventQueryParams,
  getRegionSiOptions,
  INITIAL_EVENT_FILTERS,
  mapEventTableRows,
  REGION_DO_OPTIONS,
} from "../utils";

function EventManagementPage() {
  const [filters, setFilters] = useState<EventFilterState>(INITIAL_EVENT_FILTERS);
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

  const items = useMemo(
    () => mapEventTableRows(data, appliedFilters.page, appliedFilters.size),
    [appliedFilters.page, appliedFilters.size, data],
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

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto w-full max-w-270 px-2 pt-16 pb-24">
        <div className="mb-10 flex items-start justify-between">
          <h1 className="font-pretendard tracking-brand text-fg-primary text-[24px] font-semibold">
            행사 관리
          </h1>

          <div className="flex gap-3">
            <Button onClick={handleReset}>검색조건 초기화</Button>
            <Button disabled={isFetching} onClick={handleSearch}>
              조회
            </Button>
          </div>
        </div>

        <EventManagementContent
          filters={filters}
          regionDoOptions={REGION_DO_OPTIONS}
          regionSiOptions={regionSiOptions}
          onFilterPatch={handleFilterPatch}
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
