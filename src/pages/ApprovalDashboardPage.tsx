import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ApprovalTable,
  Button,
  DateField,
  PageTitleBar,
  SerachField,
} from "../components";
import type {
  ApprovalFilterPatch,
  ApprovalFilterState,
  ApprovalTableRow,
} from "../types";
import { Header } from "../shared";
import { getList } from "../apis";

const INITIAL_APPROVAL_FILTERS: ApprovalFilterState = {
  nickname: "",
  phone: "",
  status: "",
  requestedStartAt: "",
  requestedEndAt: "",
  processedStartAt: "",
  processedEndAt: "",
  page: 0,
  size: 10,
};

function ApprovalDashboardPage() {
  const [filters, setFilters] = useState<ApprovalFilterState>(
    INITIAL_APPROVAL_FILTERS,
  );
  const [appliedFilters, setAppliedFilters] = useState<ApprovalFilterState>(
    INITIAL_APPROVAL_FILTERS,
  );

  const handleFiltersChange = (patch: ApprovalFilterPatch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handlePageSizeChange = (nextSize: number) => {
    setFilters((prev) => ({ ...prev, page: 0, size: nextSize }));
    setAppliedFilters((prev) => ({ ...prev, page: 0, size: nextSize }));
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const { data, isFetching } = useQuery({
    queryKey: ["truck-document-list", appliedFilters],
    queryFn: () => getList(appliedFilters),
  });

  const items = useMemo<ApprovalTableRow[]>(
    () =>
      (data?.content ?? []).map((item, index) => ({
        no: appliedFilters.page * appliedFilters.size + index + 1,
        truckId: item.truckId,
        documentType: item.documentType,
        documentId: item.documentId,
        nickname: item.nickname ?? "-",
        phone: item.phoneNumber ?? item.phone ?? "-",
        businessRegistrationNumber: item.businessRegistrationNumber,
        representativeName: item.representativeName,
        businessName: item.businessName,
        openingDate: item.openingDate,
        imageUrls: item.imageUrls ?? [],
        status: item.status,
        rejectionReason: item.rejectionReason ?? null,
        requestedAt: item.requestedAt,
        processedAt: item.processedAt ?? "",
      })),
    [appliedFilters.page, appliedFilters.size, data?.content],
  );

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />
      <div className="mx-auto w-full max-w-270 px-2 pt-16 pb-30">
        <PageTitleBar
          title="사업자 등록증 승인 관리"
          actions={
            <>
              <Button
                onClick={() => {
                  setFilters(INITIAL_APPROVAL_FILTERS);
                  setAppliedFilters(INITIAL_APPROVAL_FILTERS);
                }}
              >
                검색 초기화
              </Button>
              <Button
                disabled={isFetching}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, page: 0 }));
                  setAppliedFilters({ ...filters, page: 0 });
                }}
              >
                조회
              </Button>
            </>
          }
        />

        <SerachField value={filters} onChange={handleFiltersChange} />

        <DateField value={filters} onChange={handleFiltersChange} />

        <ApprovalTable
          items={items}
          totalCount={data?.totalElements ?? 0}
          pageSize={appliedFilters.size}
          onPageSizeChange={handlePageSizeChange}
          totalPages={data?.totalPages ?? 0}
          currentPage={data?.page ?? appliedFilters.page}
          onPageChange={handlePageChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}

export default ApprovalDashboardPage;
