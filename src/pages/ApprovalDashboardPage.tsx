import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../components/Button";
import ApprovalTable from "../components/approve/ApprovalTable";
import DateField from "../components/approve/DateField";
import SerachField from "../components/approve/SerachField";
import type {
  ApprovalFilterPatch,
  ApprovalFilterState,
  ApprovalTableRow,
} from "../types/approval";
import Header from "../components/Header";
import { getList } from "../apis/truck";

const INITIAL_APPROVAL_FILTERS: ApprovalFilterState = {
  nickname: "",
  phone: "",
  status: "",
  requestedStartAt: "",
  requestedEndAt: "",
  processedStartAt: "",
  processedEndAt: "",
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

  const { data = [], isFetching } = useQuery({
    queryKey: ["truck-document-list", appliedFilters],
    queryFn: () => getList(appliedFilters),
  });

  const items = useMemo<ApprovalTableRow[]>(
    () =>
      data.map((item, index) => ({
        no: index + 1,
        truckId: item.truckId,
        documentType: item.documentType,
        documentId: item.documentId,
        nickname: item.nickname ?? "-",
        phone: item.phone ?? "-",
        businessRegistrationNumber: item.businessRegistrationNumber,
        representativeName: item.representativeName,
        businessName: item.businessName,
        openingDate: item.openingDate,
        imageUrls: item.imageUrls ?? [],
        status: item.status,
        requestedAt: item.requestedAt,
        processedAt: item.processedAt ?? "",
      })),
    [data],
  );

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />
      <div className="mx-auto w-full max-w-270 px-2 pt-16 pb-30">
        <div className="flex justify-between">
          <h1 className="font-pretendard tracking-brand text-fg-primary mb-10 text-[24px] font-semibold">
            사업자 등록증 승인 관리
          </h1>
          <div className="flex gap-3">
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
              onClick={() => setAppliedFilters({ ...filters })}
            >
              조회
            </Button>
          </div>
        </div>

        <SerachField value={filters} onChange={handleFiltersChange} />

        <DateField value={filters} onChange={handleFiltersChange} />

        <ApprovalTable items={items} totalCount={items.length} />
      </div>
    </div>
  );
}

export default ApprovalDashboardPage;
