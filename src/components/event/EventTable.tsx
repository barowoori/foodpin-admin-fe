import { useState } from "react";
import { Button, Pagination, TableCountControl } from "../../components";
import type { EventTableRow } from "../../types";
import { useNavigate } from "react-router";

type EventTableProps = {
  items: EventTableRow[];
  onToggleEventHidden: (
    eventId: string,
    nextIsHidden: boolean,
  ) => Promise<void>;
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
  onToggleEventHidden,
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
  const [togglingById, setTogglingById] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleRowClick = (eventId: string) => {
    navigate(`/events/form/${eventId}`);
  };

  const handleToggleFoExposure = async (
    id: string,
    currentIsHidden: boolean,
  ) => {
    const nextIsHidden = !currentIsHidden;

    setHiddenOverrideById((prev) => ({
      ...prev,
      [id]: nextIsHidden,
    }));
    setTogglingById((prev) => ({
      ...prev,
      [id]: true,
    }));

    try {
      await onToggleEventHidden(id, nextIsHidden);
    } catch (error) {
      setHiddenOverrideById((prev) => ({
        ...prev,
        [id]: currentIsHidden,
      }));
      console.error("Failed to update event hidden state", error);
    } finally {
      setTogglingById((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  return (
    <section className="mt-14">
      <div className="mb-3 flex items-center justify-between">
        <TableCountControl
          totalCount={totalCount}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />

        <Button onClick={() => navigate("/events/form")}>등록</Button>
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
                const isToggling = togglingById[row.id] ?? false;

                return (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    className="border-border-control text-fg-primary hover:bg-bg-control/40 cursor-pointer border-b text-center text-[13px]"
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
                        disabled={isToggling}
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleToggleFoExposure(row.id, currentIsHidden);
                        }}
                        className={`focus-visible:ring-focus-ring/40 relative inline-flex h-6 w-11 items-center rounded-full border p-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
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
                          className={`bg-fg-primary h-5 w-5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        className="mt-16"
      />
    </section>
  );
}

export default EventTable;
