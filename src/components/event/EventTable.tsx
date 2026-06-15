import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Pagination, TableCountControl } from "../../components";
import type { EventDetailDate, EventTableRow } from "../../types";
import { Modal } from "../../shared";

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

type CalendarMonth = {
  key: string;
  year: number;
  month: number;
};

function formatDate(value: string) {
  return value ? value.replace(/-/g, ".") : "-";
}

function formatTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return value.slice(0, 5);
}

function buildCalendarMonths(dates: EventDetailDate[]) {
  const monthMap = new Map<string, CalendarMonth>();

  dates.forEach((entry) => {
    if (!entry.date) {
      return;
    }

    const [yearText, monthText] = entry.date.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) {
      return;
    }

    const key = `${year}-${String(month).padStart(2, "0")}`;
    if (!monthMap.has(key)) {
      monthMap.set(key, { key, year, month });
    }
  });

  return [...monthMap.values()].sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
  );
}

function buildMonthCells(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const cells: Array<string | null> = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDate; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(date);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function EventCalendarModal({
  row,
  onClose,
}: {
  row: EventTableRow;
  onClose: () => void;
}) {
  const selectedDateSet = useMemo(
    () => new Set(row.dates.map((entry) => entry.date)),
    [row.dates],
  );
  const calendarMonths = useMemo(() => buildCalendarMonths(row.dates), [row.dates]);

  return (
    <Modal onClick={onClose} className="max-w-135 px-5 py-4">
      <div className="flex w-full max-w-112 flex-col gap-3">
        <Modal.Header className="justify-center pt-0 pb-0 text-[19px] font-bold text-[#f3f6fb]">
          {row.name} 달력보기
        </Modal.Header>

        <div className="rounded-xl border border-white/10 bg-black/15 px-3.5 py-2.5 text-sm">
          <p className="text-fg-primary font-semibold">
            {row.eventDateCountText} | {row.eventPeriodRangeText}
          </p>
          <p className="text-fg-muted mt-1.5">
            운영시간: {row.operatingTime ?? "날짜별 시간 확인"}
          </p>
          {row.dates.length > 0 ? (
            <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {row.dates.map((entry) => (
                <div
                  key={`summary-${entry.id ?? entry.date}-${entry.date}`}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-black/10 px-2.5 py-1.5"
                >
                  <span className="text-fg-primary text-[12px] font-medium">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-fg-muted text-[12px]">
                    {row.operatingTime
                      ? row.operatingTime
                      : `${formatTime(entry.startTime)} ~ ${formatTime(entry.endTime)}`}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {row.isCalendarLoading ? (
          <div className="text-fg-muted rounded-xl border border-white/10 bg-black/10 px-4 py-6 text-center text-sm">
            날짜 정보를 불러오는 중입니다.
          </div>
        ) : row.dates.length === 0 ? (
          <div className="text-fg-muted rounded-xl border border-white/10 bg-black/10 px-4 py-6 text-center text-sm">
            표시할 날짜 정보가 없습니다.
          </div>
        ) : (
          <div className="grid gap-2">
            {calendarMonths.map((month) => {
              const cells = buildMonthCells(month.year, month.month);

              return (
                <div
                  key={month.key}
                  className="rounded-xl border border-white/10 bg-black/10 p-2.5"
                >
                  <div className="mb-2 text-center text-[14px] font-semibold text-[#f3f6fb]">
                    {month.year}.{String(month.month).padStart(2, "0")}
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-[#9a9a9a]">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((date, index) => {
                      if (!date) {
                        return <span key={`empty-${month.key}-${index}`} className="h-6" />;
                      }

                      const isSelected = selectedDateSet.has(date);

                      return (
                        <div
                          key={date}
                          className={`grid h-6 place-items-center rounded-md text-[11px] ${
                            isSelected
                              ? "bg-focus-ring text-fg-primary"
                              : "text-fg-subtle bg-black/10"
                          }`}
                        >
                          {Number(date.slice(-2))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal.ButtonLayout className="mt-1 pb-0">
          <Button onClick={onClose} className="min-w-28">
            닫기
          </Button>
        </Modal.ButtonLayout>
      </div>
    </Modal>
  );
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
  const [selectedCalendarEventId, setSelectedCalendarEventId] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const selectedCalendarRow =
    items.find((row) => row.id === selectedCalendarEventId) ?? null;

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
    <>
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
                      className="border-border-control text-fg-primary hover:bg-bg-control/40 border-b text-center text-[13px]"
                    >
                      <td className="px-2 py-4">{row.no}</td>
                      <td
                        className="cursor-pointer px-2 py-4 underline"
                        onClick={() => handleRowClick(row.id)}
                      >
                        {row.name}
                      </td>
                      <td className="px-2 py-4">
                        {row.regionDo}
                        {row.regionSi && row.regionSi !== "-"
                          ? ` ${row.regionSi}`
                          : ""}
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className="whitespace-pre-line font-medium">
                            {row.eventDateCountText} | {row.eventPeriodRangeText}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedCalendarEventId(row.id);
                            }}
                            className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-[#d8e4f2] transition hover:bg-white/10"
                          >
                            달력보기
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-4">{formatDate(row.recruitmentDeadline)}</td>
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
                          className={`focus-visible:ring-focus-ring/40 relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border p-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
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

      {selectedCalendarRow ? (
        <EventCalendarModal
          row={selectedCalendarRow}
          onClose={() => setSelectedCalendarEventId(null)}
        />
      ) : null}
    </>
  );
}

export default EventTable;
