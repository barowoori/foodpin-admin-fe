import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTruckBackofficeList } from "../apis";
import { Button, PageTitleBar, TruckManagementContent } from "../components";
import { Header } from "../shared";
import type { TruckFilterPatch, TruckFilterState } from "../types";
import {
  buildTruckQueryParams,
  getRegionSiOptions,
  INITIAL_TRUCK_FILTERS,
  mapTruckTableRows,
  REGION_DO_OPTIONS,
  TRUCK_BODY_TYPE_OPTIONS,
  TRUCK_CATEGORY_OPTIONS,
  TRUCK_TYPE_OPTIONS,
} from "../utils";

function TruckManagementPage() {
  const [filters, setFilters] = useState<TruckFilterState>(INITIAL_TRUCK_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<TruckFilterState>(INITIAL_TRUCK_FILTERS);

  const regionSiOptions = useMemo(
    () => getRegionSiOptions(filters.regionDo),
    [filters.regionDo],
  );

  const truckQueryParams = useMemo(
    () => buildTruckQueryParams(appliedFilters),
    [appliedFilters],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["truck-backoffice-list", truckQueryParams],
    queryFn: () => getTruckBackofficeList(truckQueryParams),
  });

  const items = useMemo(
    () => mapTruckTableRows(data, appliedFilters.page, appliedFilters.size),
    [appliedFilters.page, appliedFilters.size, data],
  );

  const handleFilterPatch = (patch: TruckFilterPatch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setFilters(INITIAL_TRUCK_FILTERS);
    setAppliedFilters(INITIAL_TRUCK_FILTERS);
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

      <div className="mx-auto w-full max-w-270 px-2 pt-12 pb-20">
        <PageTitleBar
          title="푸드트럭 관리"
          actions={
            <>
              <Button onClick={handleReset}>검색조건 초기화</Button>
              <Button disabled={isFetching} onClick={handleSearch}>
                조회
              </Button>
            </>
          }
        />

        <TruckManagementContent
          filters={filters}
          regionDoOptions={REGION_DO_OPTIONS}
          regionSiOptions={regionSiOptions}
          categoryOptions={TRUCK_CATEGORY_OPTIONS}
          typeOptions={TRUCK_TYPE_OPTIONS}
          bodyTypeOptions={TRUCK_BODY_TYPE_OPTIONS}
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

export default TruckManagementPage;
