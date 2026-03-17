import NextIcon from "../../assets/next.svg?react";
import NextDoubleIcon from "../../assets/nextx.svg?react";
import PrevIcon from "../../assets/prev.svg?react";
import PrevDoubleIcon from "../../assets/prevx.svg?react";
import ApprovalStatusSelect from "../ApprovalStatusSelect";
import type { ApprovalTableRow } from "../../types/approval";
import TableHeaderWrapper from "./table/TableHeaderWrapper";
import TableRow from "./table/TableRow";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
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
  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((option) => ({
    value: String(option),
    label: String(option),
  }));

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages <= 0 || currentPage >= totalPages - 1;

  const baseNavButtonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors [&_path]:fill-fg-muted hover:[&_path]:fill-fg-primary disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section className="mt-16">
      <div className="font-pretendard text-fg-primary mb-3 flex items-center gap-2 text-[16px]">
        <span>총 {totalCount}건</span>
        <ApprovalStatusSelect
          value={String(pageSize)}
          onChange={(next) => onPageSizeChange(Number(next))}
          options={pageSizeOptions}
          widthClassName="w-24"
        />
        <span>건씩 보기</span>
      </div>

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

      {totalPages > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-[28px]">
          <button
            type="button"
            className={baseNavButtonClass}
            disabled={isFirstPage || isFetching}
            onClick={() => onPageChange(0)}
            aria-label="첫 페이지"
          >
            <PrevDoubleIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={baseNavButtonClass}
            disabled={isFirstPage || isFetching}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="이전 페이지"
          >
            <PrevIcon className="h-4 w-4" />
          </button>

          {pageNumbers.map((pageNumber) => {
            const isActive = currentPage === pageNumber - 1;

            return (
              <button
                type="button"
                key={pageNumber}
                className={`h-10 min-w-10 rounded-lg border px-2 text-[20px] leading-none font-semibold transition-colors ${
                  isActive
                    ? "border-border-control bg-bg-control text-fg-primary"
                    : "text-fg-muted hover:border-border-control/60 hover:bg-bg-control/70 hover:text-fg-primary border-transparent"
                }`}
                disabled={isFetching}
                onClick={() => onPageChange(pageNumber - 1)}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            className={baseNavButtonClass}
            disabled={isLastPage || isFetching}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="다음 페이지"
          >
            <NextIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={baseNavButtonClass}
            disabled={isLastPage || isFetching}
            onClick={() => onPageChange(totalPages - 1)}
            aria-label="마지막 페이지"
          >
            <NextDoubleIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default ApprovalTable;
