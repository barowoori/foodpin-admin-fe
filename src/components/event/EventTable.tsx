import NextIcon from "../../assets/next.svg?react";
import NextDoubleIcon from "../../assets/nextx.svg?react";
import PrevIcon from "../../assets/prev.svg?react";
import PrevDoubleIcon from "../../assets/prevx.svg?react";
import type { EventTableRow } from "../../types";
import { ApprovalStatusSelect, Button } from "../../components";

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

  return (
    <section className="mt-14">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-pretendard text-fg-primary flex items-center gap-2 text-[16px]">
          <span>珥?{totalCount}嫄?/span>
          <ApprovalStatusSelect
            value={String(pageSize)}
            onChange={(next) => onPageSizeChange(Number(next))}
            options={pageSizeOptions}
            widthClassName="w-24"
          />
          <span>嫄댁뵫 蹂닿린</span>
        </div>

        <Button>?깅줉</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse">
          <thead className="border-border-control bg-bg-control border-y">
            <tr className="text-fg-primary text-center text-[13px]">
              <th className="px-2 py-3 font-semibold">踰덊샇</th>
              <th className="px-2 py-3 font-semibold">?됱궗紐?/th>
              <th className="px-2 py-3 font-semibold">?됱궗吏??/th>
              <th className="px-2 py-3 font-semibold">?됱궗湲곌컙</th>
              <th className="px-2 py-3 font-semibold">紐⑥쭛留덇컧??/th>
              <th className="px-2 py-3 font-semibold">怨듦퀬 ?대┃??/th>
              <th className="px-2 py-3 font-semibold">?깅줉??/th>
              <th className="px-2 py-3 font-semibold">FO ?몄텧</th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={8} className="text-fg-muted py-10 text-sm">
                  ?곗씠?곕? 遺덈윭?ㅻ뒗 以묒엯?덈떎.
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr className="border-border-control border-b text-center">
                <td colSpan={8} className="text-fg-muted py-10 text-sm">
                  議고쉶 寃곌낵媛 ?놁뒿?덈떎.
                </td>
              </tr>
            ) : (
              items.map((row) => (
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
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        row.isFoExposed
                          ? "bg-[#E8F8E8] text-[#258A28]"
                          : "bg-[#F2F2F2] text-[#666666]"
                      }`}
                    >
                      {row.isFoExposed ? "?몄텧" : "?④?"}
                    </span>
                  </td>
                </tr>
              ))
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
            aria-label="泥??섏씠吏"
          >
            <PrevDoubleIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={navButtonClass}
            disabled={isFirstPage}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="?댁쟾 ?섏씠吏"
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
            aria-label="?ㅼ쓬 ?섏씠吏"
          >
            <NextIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={navButtonClass}
            disabled={isLastPage}
            onClick={() => onPageChange(totalPages - 1)}
            aria-label="留덉?留??섏씠吏"
          >
            <NextDoubleIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default EventTable;


