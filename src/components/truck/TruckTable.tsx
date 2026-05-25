import { useNavigate } from "react-router";
import { Button, Pagination, TableCountControl } from "../../components";
import type { TruckTableRow } from "../../types";

type TruckTableProps = {
  items: TruckTableRow[];
  totalCount: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  onPageSizeChange: (nextSize: number) => void;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function formatPrice(value: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return `${value.toLocaleString("ko-KR")}원`;
}

function formatMenuNames(menuNames: string[]) {
  if (menuNames.length === 0) {
    return "-";
  }

  return menuNames.join(", ");
}

function getApprovalLabel(isApproved: boolean) {
  return isApproved ? "승인 완료" : "승인 미완료";
}

function TruckTable({
  items,
  totalCount,
  pageSize,
  totalPages,
  currentPage,
  onPageSizeChange,
  onPageChange,
  isFetching = false,
}: TruckTableProps) {
  const navigate = useNavigate();

  return (
    <section className="mt-14">
      <div className="mb-3 flex items-center justify-between gap-3">
        <TableCountControl
          totalCount={totalCount}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
        <Button onClick={() => navigate("/trucks/form")}>등록</Button>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[16%]" />
            <col className="w-[30%]" />
            <col className="w-[11%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead className="border-border-control bg-bg-control border-y">
            <tr className="text-fg-primary text-center text-[13px]">
              <th className="px-2 py-3 font-semibold whitespace-nowrap">
                번호
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                푸드트럭명
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                운영 지역
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                평균 가격
              </th>
              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                메뉴명
              </th>
              <th className="px-3 py-3 leading-tight font-semibold break-keep">
                사업자등록 승인여부
              </th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={6} className="text-fg-muted py-10 text-sm">
                  데이터를 불러오는 중입니다.
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={6} className="text-fg-muted py-10 text-sm">
                  조회 결과가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr
                  key={row.id}
                  className="border-border-control text-fg-primary hover:bg-bg-control/40 border-b text-center text-[13px]"
                >
                  <td className="px-2 py-4 align-middle whitespace-nowrap">
                    {row.no}
                  </td>
                  <td
                    className="cursor-pointer px-3 py-4 text-center align-middle font-medium break-keep underline"
                    onClick={() => navigate(`/trucks/form/${row.id}`)}
                  >
                    {row.name}
                  </td>
                  <td className="px-3 py-4 align-middle break-keep">
                    {row.regionList}
                  </td>
                  <td className="px-3 py-4 align-middle whitespace-nowrap">
                    {formatPrice(row.avgMenuPrice)}
                  </td>
                  <td className="px-3 py-4 align-middle break-keep">
                    {formatMenuNames(row.menuNames)}
                  </td>
                  <td className="px-3 py-4 align-middle whitespace-nowrap">
                    {getApprovalLabel(row.businessRegistrationApproved)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        className="mt-16"
      />
    </section>
  );
}

export default TruckTable;
