import NextIcon from "../assets/next.svg?react";
import NextDoubleIcon from "../assets/nextx.svg?react";
import PrevIcon from "../assets/prev.svg?react";
import PrevDoubleIcon from "../assets/prevx.svg?react";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
  disabled?: boolean;
  className?: string;
};

function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  disabled = false,
  className = "",
}: PaginationProps) {
  if (totalPages <= 0) {
    return null;
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;

  const navButtonClass =
    "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors [&_path]:fill-fg-muted hover:[&_path]:fill-fg-primary disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1 ${className}`.trim()}
    >
      <button
        type="button"
        className={navButtonClass}
        disabled={isFirstPage || disabled}
        onClick={() => onPageChange(0)}
        aria-label="첫 페이지"
      >
        <PrevDoubleIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        className={navButtonClass}
        disabled={isFirstPage || disabled}
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
            className={`h-10 min-w-10 cursor-pointer rounded-lg border px-2 text-[20px] leading-none font-semibold transition-colors disabled:cursor-not-allowed ${
              isActive
                ? "border-border-control bg-bg-control text-fg-primary"
                : "text-fg-muted hover:border-border-control/60 hover:bg-bg-control/70 hover:text-fg-primary border-transparent"
            }`}
            disabled={disabled}
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
        disabled={isLastPage || disabled}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <NextIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        className={navButtonClass}
        disabled={isLastPage || disabled}
        onClick={() => onPageChange(totalPages - 1)}
        aria-label="마지막 페이지"
      >
        <NextDoubleIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Pagination;
