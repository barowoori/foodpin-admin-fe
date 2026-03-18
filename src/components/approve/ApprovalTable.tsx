import { Pagination, TableCountControl } from "../../components";
import type { ApprovalTableRow } from "../../types";
import { TableHeaderWrapper } from "./table";
import { TableRow } from "./table";

const TABLE_GRID_CLASS =
  "grid w-full grid-cols-[32px_62px_86px_104px_74px_minmax(74px,1fr)_68px_84px_70px_74px_74px_80px] items-center gap-x-[13px] text-center text-[13px] leading-tight [&>span]:min-w-0 [&>span]:truncate [&>span:nth-child(6)]:overflow-visible [&>span:nth-child(6)]:text-clip [&>span:nth-child(6)]:whitespace-normal [&>span:nth-child(6)]:break-all [&>span:nth-child(10)]:overflow-visible [&>span:nth-child(10)]:text-clip [&>span:nth-child(10)]:whitespace-normal [&>span:nth-child(11)]:overflow-visible [&>span:nth-child(11)]:text-clip [&>span:nth-child(11)]:whitespace-normal";

type ApprovalTableProps = {
  items: ApprovalTableRow[];
  totalCount?: number;
  pageSize: number;
  onPageSizeChange: (next: number) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function ApprovalTable({
  items,
  totalCount = items.length,
  pageSize,
  onPageSizeChange,
  totalPages,
  currentPage,
  onPageChange,
  isFetching = false,
}: ApprovalTableProps) {
  return (
    <section className="mt-16">
      <TableCountControl
        totalCount={totalCount}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        className="mb-3"
      />

      <div className="overflow-x-auto">
        <TableHeaderWrapper gridClassName={TABLE_GRID_CLASS}>
          <span>번호</span>
          <span>닉네임</span>
          <span>휴대폰번호</span>
          <span>사업자등록번호</span>
          <span>대표자 성명</span>
          <span>상호</span>
          <span>개업일자</span>
          <span>이미지</span>
          <span>승인상태</span>
          <span>요청일시</span>
          <span>처리일시</span>
          <span>관리</span>
        </TableHeaderWrapper>

        {items.map((row) => (
          <div
            key={`${row.truckId}-${row.no}`}
            className="border-border-control text-fg-primary border-b p-3.25"
          >
            <div className={TABLE_GRID_CLASS}>
              <TableRow item={row} />
            </div>
          </div>
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        disabled={isFetching}
        className="mt-6 text-[28px]"
      />
    </section>
  );
}

export default ApprovalTable;
