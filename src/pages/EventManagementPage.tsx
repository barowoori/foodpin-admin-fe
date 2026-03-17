import { useMemo, useState } from "react";
import Button from "../components/Button";
import EventDateField from "../components/event/EventDateField";
import EventSearchField from "../components/event/EventSearchField";
import EventTable from "../components/event/EventTable";
import doCsvRaw from "../data/do.csv?raw";
import siCsvRaw from "../data/si.csv?raw";
import Header from "../shared/Header";
import type {
  EventFilterPatch,
  EventFilterState,
  EventRow,
  EventTableRow,
} from "../types/event";

const INITIAL_EVENT_FILTERS: EventFilterState = {
  name: "",
  regionDo: "",
  regionSi: "",
  eventStartAt: "",
  eventEndAt: "",
  deadlineStartAt: "",
  deadlineEndAt: "",
  page: 0,
  size: 10,
};

type SelectOption = { value: string; label: string };
type CsvRow = Record<string, string>;

const SELECT_ALL_OPTION: SelectOption = { value: "", label: "전체" };

function parseCsvRows(csvRaw: string): CsvRow[] {
  const normalized = csvRaw.replace(/^\uFEFF/, "").trim();
  if (!normalized) {
    return [];
  }

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) {
    return [];
  }

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const columns = line.split(",");
    return headers.reduce<CsvRow>((row, header, index) => {
      row[header] = (columns[index] ?? "").trim();
      return row;
    }, {});
  });
}

function createRegionOptions() {
  const doRows = parseCsvRows(doCsvRaw);
  const siRows = parseCsvRows(siCsvRaw);
  const doNameById = new Map<string, string>();
  const regionDoOptions: SelectOption[] = [{ ...SELECT_ALL_OPTION }];
  const regionSiOptionsMap: Record<string, SelectOption[]> = {};
  const seenDoNames = new Set<string>();
  const seenSiByRegion = new Map<string, Set<string>>();

  const ensureRegionKey = (regionName: string) => {
    if (!regionSiOptionsMap[regionName]) {
      regionSiOptionsMap[regionName] = [{ ...SELECT_ALL_OPTION }];
    }
  };

  const addDoOption = (regionName: string, regionId?: string) => {
    if (!regionName || seenDoNames.has(regionName)) {
      return;
    }

    seenDoNames.add(regionName);
    regionDoOptions.push({ value: regionName, label: regionName });
    ensureRegionKey(regionName);

    if (regionId) {
      doNameById.set(regionId, regionName);
    }
  };

  const addSiOption = (regionName: string, cityName: string) => {
    if (!cityName) {
      return;
    }

    ensureRegionKey(regionName);

    const seen = seenSiByRegion.get(regionName) ?? new Set<string>();
    if (seen.has(cityName)) {
      return;
    }

    seen.add(cityName);
    seenSiByRegion.set(regionName, seen);
    regionSiOptionsMap[regionName].push({ value: cityName, label: cityName });
  };

  doRows.forEach((row) => addDoOption(row.name, row.id));
  siRows
    .filter((row) => !row.region_do_id)
    .forEach((row) => addDoOption(row.name));

  ensureRegionKey("");
  siRows.forEach((row) => addSiOption("", row.name));

  siRows.forEach((row) => {
    const parentRegion = doNameById.get(row.region_do_id);
    if (!parentRegion) {
      return;
    }

    addSiOption(parentRegion, row.name);
  });

  return {
    regionDoOptions,
    regionSiOptionsMap,
  };
}

const { regionDoOptions: REGION_DO_OPTIONS, regionSiOptionsMap: REGION_SI_OPTIONS_MAP } =
  createRegionOptions();

const INITIAL_EVENT_ROWS: EventRow[] = [
  {
    id: 2,
    name: "2025 제3회 전주예술난장",
    regionDo: "전라북도",
    regionSi: "전주시",
    eventStart: "2025-09-01",
    eventEnd: "2025-09-20",
    recruitmentDeadline: "2025-08-18",
    clickCount: 1,
    createdAt: "2025-08-01",
    isFoExposed: true,
  },
  {
    id: 1,
    name: "2025 북항친수공원 푸드트럭 영업자 모집",
    regionDo: "부산광역시",
    regionSi: "동구",
    eventStart: "2025-08-12",
    eventEnd: "2025-08-30",
    recruitmentDeadline: "2025-08-01",
    clickCount: 20,
    createdAt: "2025-07-22",
    isFoExposed: false,
  },
];

function isBetween(date: string, start: string, end: string) {
  if (!date) {
    return false;
  }

  if (start && date < start) {
    return false;
  }

  if (end && date > end) {
    return false;
  }

  return true;
}

function EventManagementPage() {
  const [rows, setRows] = useState<EventRow[]>(INITIAL_EVENT_ROWS);
  const [filters, setFilters] = useState<EventFilterState>(INITIAL_EVENT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<EventFilterState>(INITIAL_EVENT_FILTERS);

  const regionSiOptions = useMemo(
    () => REGION_SI_OPTIONS_MAP[filters.regionDo] ?? REGION_SI_OPTIONS_MAP[""],
    [filters.regionDo],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (appliedFilters.name && !row.name.includes(appliedFilters.name.trim())) {
        return false;
      }

      if (appliedFilters.regionDo && row.regionDo !== appliedFilters.regionDo) {
        return false;
      }

      if (appliedFilters.regionSi && row.regionSi !== appliedFilters.regionSi) {
        return false;
      }

      if (
        (appliedFilters.eventStartAt || appliedFilters.eventEndAt) &&
        !isBetween(
          row.eventStart,
          appliedFilters.eventStartAt,
          appliedFilters.eventEndAt,
        )
      ) {
        return false;
      }

      if (
        (appliedFilters.deadlineStartAt || appliedFilters.deadlineEndAt) &&
        !isBetween(
          row.recruitmentDeadline,
          appliedFilters.deadlineStartAt,
          appliedFilters.deadlineEndAt,
        )
      ) {
        return false;
      }

      return true;
    });
  }, [rows, appliedFilters]);

  const totalCount = filteredRows.length;
  const totalPages = Math.ceil(totalCount / appliedFilters.size);
  const currentPage =
    totalPages > 0 ? Math.min(appliedFilters.page, totalPages - 1) : 0;

  const tableRows = useMemo<EventTableRow[]>(() => {
    const start = currentPage * appliedFilters.size;
    const pageRows = filteredRows.slice(start, start + appliedFilters.size);

    return pageRows.map((row, index) => ({
      ...row,
      no: totalCount - (start + index),
    }));
  }, [appliedFilters.size, currentPage, filteredRows, totalCount]);

  const handleFilterPatch = (patch: EventFilterPatch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handlePageSizeChange = (nextSize: number) => {
    const next = { ...appliedFilters, page: 0, size: nextSize };
    setFilters(next);
    setAppliedFilters(next);
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const toggleFoExposure = (id: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, isFoExposed: !row.isFoExposed } : row,
      ),
    );
  };

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto w-full max-w-270 px-2 pt-16 pb-24">
        <div className="mb-10 flex items-start justify-between">
          <h1 className="font-pretendard tracking-brand text-fg-primary text-[24px] font-semibold">
            행사 관리
          </h1>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setFilters(INITIAL_EVENT_FILTERS);
                setAppliedFilters(INITIAL_EVENT_FILTERS);
              }}
            >
              검색조건 초기화
            </Button>
            <Button
              onClick={() => {
                const nextApplied = { ...filters, page: 0 };
                setFilters(nextApplied);
                setAppliedFilters(nextApplied);
              }}
            >
              조회
            </Button>
          </div>
        </div>

        <EventSearchField
          value={filters}
          regionDoOptions={REGION_DO_OPTIONS}
          regionSiOptions={regionSiOptions}
          onChange={handleFilterPatch}
        />

        <EventDateField value={filters} onChange={handleFilterPatch} />

        <EventTable
          items={tableRows}
          totalCount={totalCount}
          pageSize={appliedFilters.size}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          onToggleFoExposure={toggleFoExposure}
        />
      </div>
    </div>
  );
}

export default EventManagementPage;
