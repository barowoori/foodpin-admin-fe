import doCsvRaw from "../data/do.csv?raw";
import siCsvRaw from "../data/si.csv?raw";
import guCsvRaw from "../data/gu.csv?raw";
import gunCsvRaw from "../data/gun.csv?raw";
import type { EventListParams } from "../apis";
import type {
  EventFilterState,
  EventListResult,
  EventTableRow,
} from "../types";

type CsvRow = Record<string, string>;

export type RegionSelectOption = {
  value: string;
  label: string;
};

const SELECT_ALL_OPTION: RegionSelectOption = { value: "", label: "전체" };

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

function toDoCode(id: string) {
  return `DO${id}`;
}

function toSiCode(id: string) {
  return `SI${id}`;
}

function toGuCode(id: string) {
  return `GU${id}`;
}

function toGunCode(id: string) {
  return `GUN${id}`;
}

function normalizeDoLabel(name: string) {
  return name
    .replace("특별자치도", "")
    .replace("특별자치시", "")
    .replace("특별시", "")
    .replace("광역시", "")
    .replace(/도$/, "");
}

function createRegionOptions() {
  const doRows = parseCsvRows(doCsvRaw);
  const siRows = parseCsvRows(siCsvRaw);
  const guRows = parseCsvRows(guCsvRaw);
  const gunRows = parseCsvRows(gunCsvRaw);
  const doCodeById = new Map<string, string>();
  const parentDoCodeBySiId = new Map<string, string>();
  const regionDoOptions: RegionSelectOption[] = [{ ...SELECT_ALL_OPTION }];
  const regionSiOptionsMap: Record<string, RegionSelectOption[]> = {
    "": [{ ...SELECT_ALL_OPTION }],
  };
  const seenDoCodes = new Set<string>();
  const seenSiByParent = new Map<string, Set<string>>();

  const ensureRegionKey = (regionCode: string) => {
    if (!regionSiOptionsMap[regionCode]) {
      regionSiOptionsMap[regionCode] = [{ ...SELECT_ALL_OPTION }];
    }
  };

  const addDoOption = (regionName: string, regionCode: string) => {
    if (!regionName || !regionCode || seenDoCodes.has(regionCode)) {
      return;
    }

    seenDoCodes.add(regionCode);
    regionDoOptions.push({
      value: regionCode,
      label: normalizeDoLabel(regionName),
    });
    ensureRegionKey(regionCode);
  };

  const addSiOption = (
    parentRegionCode: string,
    regionName: string,
    regionCode: string,
  ) => {
    if (!regionName || !regionCode) {
      return;
    }

    ensureRegionKey(parentRegionCode);

    const seen = seenSiByParent.get(parentRegionCode) ?? new Set<string>();
    if (seen.has(regionCode)) {
      return;
    }

    seen.add(regionCode);
    seenSiByParent.set(parentRegionCode, seen);
    regionSiOptionsMap[parentRegionCode].push({
      value: regionCode,
      label: regionName,
    });
  };

  doRows.forEach((row) => {
    const code = toDoCode(row.id);
    addDoOption(row.name, code);
    doCodeById.set(row.id, code);
  });

  siRows.forEach((row) => {
    const siCode = toSiCode(row.id);

    if (!row.region_do_id) {
      addDoOption(row.name, siCode);
      parentDoCodeBySiId.set(row.id, siCode);
      return;
    }

    const parentCode = doCodeById.get(row.region_do_id);
    if (parentCode) {
      parentDoCodeBySiId.set(row.id, parentCode);
      addSiOption(parentCode, row.name, siCode);
    }
  });

  guRows.forEach((row) => {
    const guCode = toGuCode(row.id);
    const parentCode = row.region_do_id
      ? doCodeById.get(row.region_do_id)
      : row.region_si_id
        ? parentDoCodeBySiId.get(row.region_si_id)
        : undefined;

    if (parentCode) {
      addSiOption(parentCode, row.name, guCode);
    }
  });

  gunRows.forEach((row) => {
    const gunCode = toGunCode(row.id);
    const parentCode = row.region_do_id
      ? doCodeById.get(row.region_do_id)
      : row.region_si_id
        ? parentDoCodeBySiId.get(row.region_si_id)
        : undefined;

    if (parentCode) {
      addSiOption(parentCode, row.name, gunCode);
    }
  });

  return {
    regionDoOptions,
    regionSiOptionsMap,
  };
}

const REGION_OPTIONS = createRegionOptions();

export const REGION_DO_OPTIONS = REGION_OPTIONS.regionDoOptions;

export function getRegionSiOptions(regionDo: string) {
  return (
    REGION_OPTIONS.regionSiOptionsMap[regionDo] ??
    REGION_OPTIONS.regionSiOptionsMap[""]
  );
}

export const INITIAL_EVENT_FILTERS: EventFilterState = {
  search: "",
  regionDo: "",
  regionSi: "",
  startDate: "",
  endDate: "",
  recruitEndDateFrom: "",
  recruitEndDateTo: "",
  page: 0,
  size: 10,
};

export function buildEventQueryParams(
  filters: EventFilterState,
): EventListParams {
  const selectedRegionCode = filters.regionSi || filters.regionDo;

  return {
    search: filters.search.trim() || undefined,
    region: selectedRegionCode ? [selectedRegionCode] : undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    recruitEndDateFrom: filters.recruitEndDateFrom || undefined,
    recruitEndDateTo: filters.recruitEndDateTo || undefined,
    page: filters.page,
    size: filters.size,
  };
}

function splitRegionName(region: string) {
  const tokens = region.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { regionDo: "-", regionSi: "-" };
  }

  const [regionDo, ...rest] = tokens;
  return {
    regionDo,
    regionSi: rest.join(" ") || "-",
  };
}

function toDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.split("T")[0];
}

export function mapEventTableRows(
  data: EventListResult | undefined,
  page: number,
  size: number,
): EventTableRow[] {
  const resolvedPage = data?.page ?? page;
  const resolvedSize = data?.size ?? size;

  return (data?.content ?? []).map((item, index) => {
    const { regionDo, regionSi } = splitRegionName(item.region);

    return {
      no: resolvedPage * resolvedSize + index + 1,
      id: item.id,
      name: item.name ?? "-",
      regionDo,
      regionSi,
      eventStart: toDate(item.startDate),
      eventEnd: toDate(item.endDate),
      recruitmentDeadline: toDate(item.recruitEndDateTime),
      clickCount: item.recruitmentUrlClickCount ?? 0,
      createdAt: toDate(item.createdAt) || toDate(data?.createAt),
      isHidden: item.isHidden,
    };
  });
}
