import { useState } from "react";
import NextIcon from "../../assets/next.svg?react";
import NextDoubleIcon from "../../assets/nextx.svg?react";
import PrevIcon from "../../assets/prev.svg?react";
import PrevDoubleIcon from "../../assets/prevx.svg?react";
import { ApprovalStatusSelect, Button } from "../../components";
import type { EventTableRow } from "../../types";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type EventTableProps = {
  items: EventTableRow[];
  totalCount: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  onPageSizeChange: (nextSize: number) => void;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function formatDate(value: string) {
  return value ? value.replace(/-/g, ".") : "-";
}

function EventTable({
  items,
  totalCount,
  pageSize,
  totalPages,
  currentPage,
  onPageSizeChange,
  onPageChange,
  isFetching = false,
}: EventTableProps) {
  const [hiddenOverrideById, setHiddenOverrideById] = useState<
    Record<string, boolean>
  >({});

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

  const navButtonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors [&_path]:fill-fg-muted hover:[&_path]:fill-fg-primary disabled:cursor-not-allowed disabled:opacity-40";

  const handleToggleFoExposure = (id: string, currentIsHidden: boolean) => {
    setHiddenOverrideById((prev) => ({
      ...prev,
      [id]: !currentIsHidden,
    }));
  };

  return (
    <section className="mt-14">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-pretendard text-fg-primary flex items-center gap-2 text-[16px]">
          <span>총 {totalCount}건</span>
          <ApprovalStatusSelect
            value={String(pageSize)}
            onChange={(next) => onPageSizeChange(Number(next))}
            options={pageSizeOptions}
            widthClassName="w-24"
          />
          <span>건씩 보기</span>
        </div>

        <Button>등록</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse">
          <thead className="border-border-control bg-bg-control border-y">
            <tr className="text-fg-primary text-center text-[13px]">
              <th className="px-2 py-3 font-semibold">번호</th>
              <th className="px-2 py-3 font-semibold">행사명</th>
              <th className="px-2 py-3 font-semibold">행사지역</th>
              <th className="px-2 py-3 font-semibold">행사기간</th>
              <th className="px-2 py-3 font-semibold">모집마감일</th>
              <th className="px-2 py-3 font-semibold">공고 클릭수</th>
              <th className="px-2 py-3 font-semibold">등록일</th>
              <th className="px-2 py-3 font-semibold">FO 노출</th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={8} className="text-fg-muted py-10 text-sm">
                  데이터를 불러오는 중입니다.
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={8} className="text-fg-muted py-10 text-sm">
                  조회 결과가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const currentIsHidden =
                  hiddenOverrideById[row.id] ?? row.isHidden;
                const isFoExposed = !currentIsHidden;

                return (
                  <tr
                    key={row.id}
                    className="border-border-control text-fg-primary border-b text-center text-[13px]"
                  >
                    <td className="px-2 py-4">{row.no}</td>
                    <td className="px-2 py-4">{row.name}</td>
                    <td className="px-2 py-4">
                      {row.regionDo}
                      {row.regionSi && row.regionSi !== "-"
                        ? ` ${row.regionSi}`
                        : ""}
                    </td>
                    <td className="px-2 py-4 whitespace-pre-line">
                      {formatDate(row.eventStart)}
                      {"\n"}
                      {formatDate(row.eventEnd)}
                    </td>
                    <td className="px-2 py-4">
                      {formatDate(row.recruitmentDeadline)}
                    </td>
                    <td className="px-2 py-4">{row.clickCount}</td>
                    <td className="px-2 py-4">{formatDate(row.createdAt)}</td>
                    <td className="px-2 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isFoExposed}
                          aria-label={`${row.name} FO 노출 ${isFoExposed ? "켜짐" : "꺼짐"}`}
                          onClick={() =>
                            handleToggleFoExposure(row.id, currentIsHidden)
                          }
                          className={`focus-visible:ring-focus-ring/40 relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border p-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                            isFoExposed
                              ? "border-[#6F8198] bg-[#5F738A]"
                              : "border-border-control bg-bg-control"
                          }`}
                        >
                          <span className="sr-only">
                            {isFoExposed ? "노출" : "미노출"}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`h-5 w-5 rounded-full bg-fg-primary shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
                              isFoExposed ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="mt-16 flex flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            className={navButtonClass}
            disabled={isFirstPage}
            onClick={() => onPageChange(0)}
            aria-label="첫 페이지"
          >
            <PrevDoubleIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={navButtonClass}
            disabled={isFirstPage}
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
                onClick={() => onPageChange(pageNumber - 1)}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            className={navButtonClass}
            disabled={isLastPage}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="다음 페이지"
          >
            <NextIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={navButtonClass}
            disabled={isLastPage}
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

export default EventTable;
