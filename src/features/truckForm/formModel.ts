import type {
  TruckBasicInfoFormState,
  TruckBodyType,
  TruckColor,
  TruckCreateRequestBody,
  TruckDetailData,
  TruckDocumentFormState,
  TruckFormStateBundle,
  TruckMenuFormItem,
  TruckMenuFormState,
  TruckPaymentFormState,
  TruckPaymentMethod,
  TruckProofIssuanceType,
  TruckTypeCode,
  TruckUpdateRequestBody,
} from "../../types";

type Option<T extends string> = {
  value: T;
  label: string;
};

export const TRUCK_COLOR_OPTIONS: Array<Option<TruckColor>> = [
  { value: "RED", label: "레드" },
  { value: "ORANGE", label: "오렌지" },
  { value: "YELLOW", label: "옐로우" },
  { value: "LIGHT_GREEN", label: "라이트그린" },
  { value: "GREEN", label: "그린" },
  { value: "SKY_BLUE", label: "스카이블루" },
  { value: "BLUE", label: "블루" },
  { value: "MINT", label: "민트" },
  { value: "NAVY", label: "네이비" },
  { value: "PURPLE", label: "퍼플" },
  { value: "PINK", label: "핑크" },
  { value: "BROWN", label: "브라운" },
  { value: "BLACK", label: "블랙" },
  { value: "WHITE", label: "화이트" },
];

export const TRUCK_BODY_TYPE_OPTIONS: Array<Option<TruckBodyType>> = [
  { value: "WING_BODY", label: "윙바디" },
  { value: "STANDARD", label: "표준형" },
  { value: "OTHER", label: "기타" },
];

export const TRUCK_TYPE_OPTIONS: Array<Option<TruckTypeCode>> = [
  { value: "SNACK", label: "간식차" },
  { value: "MEAL", label: "식사차" },
  { value: "STREET_FOOD", label: "분식차" },
  { value: "COFFEE", label: "커피차" },
];

export const TRUCK_CATEGORY_OPTIONS: Array<Option<string>> = [
  { value: "C01", label: "한식" },
  { value: "C02", label: "양식" },
  { value: "C03", label: "일식" },
  { value: "C04", label: "중식" },
  { value: "C05", label: "분식" },
  { value: "C06", label: "세계음식" },
  { value: "C07", label: "기타" },
];

export const TRUCK_PAYMENT_METHOD_OPTIONS: Array<Option<TruckPaymentMethod>> = [
  { value: "CASH", label: "현금결제" },
  { value: "TRANSFER", label: "계좌이체" },
  { value: "CARD", label: "카드결제" },
];

export const TRUCK_PROOF_ISSUANCE_OPTIONS: Array<
  Option<TruckProofIssuanceType>
> = [
  { value: "CASH_RECEIPT", label: "현금영수증 발행 가능" },
  { value: "TAX_INVOICE", label: "세금계산서 발행 가능" },
];

export function createEmptyTruckMenuFormItem(): TruckMenuFormItem {
  return {
    localId: crypto.randomUUID(),
    name: "",
    description: "",
    price: "",
    fileIdList: [],
    photoFiles: [],
    photoPaths: [],
  };
}

export const INITIAL_TRUCK_FORM_STATE: TruckFormStateBundle = {
  ownerForm: {
    ownerMemberId: "",
    managerMemberIdsText: "",
  },
  basicInfoForm: {
    name: "",
    description: "",
    fileIdList: [],
    photoFiles: [],
    photoPaths: [],
    truckColors: [],
    bodyType: "",
  },
  operationForm: {
    electricityUsage: null,
    gasUsage: null,
    selfGenerationAvailability: null,
    regionDo: "",
    regionSi: "",
    regions: [],
    isCatering: null,
  },
  menuForm: {
    truckCategoryCodeSet: [],
    types: [],
    truckMenuDtoList: [createEmptyTruckMenuFormItem()],
  },
  paymentForm: {
    paymentMethods: [],
    proofIssuanceTypes: [],
  },
  documentForm: {
    type: "BUSINESS_REGISTRATION",
    businessNumber: "",
    businessName: "",
    representativeName: "",
    openingDate: "",
    fileIdList: [],
    photoFiles: [],
    photoPaths: [],
    status: "",
    date: "",
    rejectionReason: "",
  },
};

export function toggleListItem<T extends string>(list: T[], value: T) {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }

  return [...list, value];
}

function sanitizeMenuPrice(value: string) {
  return value.replace(/[^\d]/g, "");
}

function parseManagerMemberIds(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildDocumentPayload(documentForm: TruckDocumentFormState) {
  const hasBusinessInfo = Boolean(
    documentForm.businessNumber.trim() ||
      documentForm.businessName.trim() ||
      documentForm.representativeName.trim() ||
      documentForm.openingDate ||
      documentForm.fileIdList.length > 0 ||
      documentForm.status ||
      documentForm.date ||
      documentForm.rejectionReason.trim(),
  );

  if (!hasBusinessInfo) {
    return [];
  }

  return [
    {
      type: documentForm.type,
      ...(documentForm.businessNumber.trim() ||
      documentForm.businessName.trim() ||
      documentForm.representativeName.trim() ||
      documentForm.openingDate
        ? {
            createBusinessRegistrationDto: {
              businessNumber: documentForm.businessNumber.trim(),
              businessName: documentForm.businessName.trim(),
              representativeName: documentForm.representativeName.trim(),
              openingDate: documentForm.openingDate,
            },
          }
        : {}),
      fileIdList: documentForm.fileIdList,
    },
  ];
}

function buildMenuPayload(menuForm: TruckMenuFormState) {
  return menuForm.truckMenuDtoList
    .map((menu) => ({
      name: menu.name.trim(),
      description: menu.description.trim(),
      price: Number(sanitizeMenuPrice(menu.price) || 0),
      fileIdList: menu.fileIdList,
    }))
    .filter((menu) => menu.name || menu.description || menu.price > 0);
}

function createValidationError(message: string) {
  return {
    requestBody: null,
    errorMessage: message,
  } as const;
}

function validateCommonTruckForm(
  basicInfoForm: TruckBasicInfoFormState,
  operationForm: TruckFormStateBundle["operationForm"],
  menuForm: TruckMenuFormState,
  paymentForm: TruckPaymentFormState,
) {
  if (!basicInfoForm.name.trim()) {
    return "푸드트럭명을 입력해주세요.";
  }

  if (!basicInfoForm.description.trim()) {
    return "소개를 입력해주세요.";
  }

  if (!basicInfoForm.bodyType) {
    return "푸드트럭 타입을 선택해주세요.";
  }

  if (operationForm.electricityUsage === null) {
    return "전기 사용 여부를 선택해주세요.";
  }

  if (operationForm.gasUsage === null) {
    return "가스 사용 여부를 선택해주세요.";
  }

  if (operationForm.selfGenerationAvailability === null) {
    return "자가발전 가능 여부를 선택해주세요.";
  }

  if (operationForm.isCatering === null) {
    return "케이터링 가능 여부를 선택해주세요.";
  }

  if (operationForm.regions.length === 0) {
    return "운영 지역을 하나 이상 추가해주세요.";
  }

  if (menuForm.types.length === 0) {
    return "푸드트럭 유형을 선택해주세요.";
  }

  if (menuForm.truckCategoryCodeSet.length === 0) {
    return "메뉴 카테고리를 선택해주세요.";
  }

  if (buildMenuPayload(menuForm).length === 0) {
    return "메뉴를 한 개 이상 입력해주세요.";
  }

  if (paymentForm.paymentMethods.length === 0) {
    return "결제방식을 선택해주세요.";
  }

  if (paymentForm.proofIssuanceTypes.length === 0) {
    return "증빙발행 가능 항목을 선택해주세요.";
  }

  return null;
}

export function mapDetailToTruckFormState(detail: TruckDetailData): TruckFormStateBundle {
  const businessRegistrationInfo = detail.documentInfos.find(
    (document) => document.type === "BUSINESS_REGISTRATION",
  );

  return {
    ownerForm: {
      ownerMemberId: "",
      managerMemberIdsText: "",
    },
    basicInfoForm: {
      name: detail.truck.name ?? "",
      description: detail.truck.description ?? "",
      fileIdList: detail.truck.photos.map((photo) => photo.id),
      photoFiles: [],
      photoPaths: detail.truck.photos.map((photo) => photo.path),
      truckColors: detail.truck.truckColors ?? [],
      bodyType: detail.truck.bodyType ?? "",
    },
    operationForm: {
      electricityUsage: detail.truck.electricityUsage,
      gasUsage: detail.truck.gasUsage,
      selfGenerationAvailability: detail.truck.selfGenerationAvailability,
      regionDo: "",
      regionSi: "",
      regions: detail.regions ?? [],
      isCatering: detail.truck.isCatering,
    },
    menuForm: {
      truckCategoryCodeSet: detail.categories.map((category) => category.code),
      types: detail.truck.types ?? [],
      truckMenuDtoList:
        detail.menus.length > 0
          ? detail.menus.map((menu) => ({
              localId: crypto.randomUUID(),
              id: menu.id,
              name: menu.name ?? "",
              description: menu.description ?? "",
              price: String(menu.price ?? ""),
              fileIdList: menu.photos.map((photo) => photo.id),
              photoFiles: [],
              photoPaths: menu.photos.map((photo) => photo.path),
            }))
          : [createEmptyTruckMenuFormItem()],
    },
    paymentForm: {
      paymentMethods: detail.truck.paymentMethods ?? [],
      proofIssuanceTypes: detail.truck.proofIssuanceTypes ?? [],
    },
    documentForm: {
      type: "BUSINESS_REGISTRATION",
      businessNumber: "",
      businessName: "",
      representativeName: "",
      openingDate: "",
      fileIdList: [],
      photoFiles: [],
      photoPaths: [],
      status: businessRegistrationInfo?.status ?? "",
      date: businessRegistrationInfo?.date ?? "",
      rejectionReason: businessRegistrationInfo?.rejectionReason ?? "",
    },
  };
}

export function buildCreateTruckRequestBody(
  formState: TruckFormStateBundle,
):
  | { requestBody: TruckCreateRequestBody; errorMessage?: never }
  | { requestBody: null; errorMessage: string } {
  const validationError = validateCommonTruckForm(
    formState.basicInfoForm,
    formState.operationForm,
    formState.menuForm,
    formState.paymentForm,
  );

  if (validationError) {
    return createValidationError(validationError);
  }

  if (!formState.ownerForm.ownerMemberId.trim()) {
    return createValidationError("소유자 회원 ID를 입력해주세요.");
  }

  const requestBody: TruckCreateRequestBody = {
    ownerMemberId: formState.ownerForm.ownerMemberId.trim(),
    managerMemberIds: parseManagerMemberIds(
      formState.ownerForm.managerMemberIdsText,
    ),
    createTruckDto: {
      truckInfoDto: {
        name: formState.basicInfoForm.name.trim(),
        description: formState.basicInfoForm.description.trim(),
        electricityUsage: Boolean(formState.operationForm.electricityUsage),
        gasUsage: Boolean(formState.operationForm.gasUsage),
        selfGenerationAvailability: Boolean(
          formState.operationForm.selfGenerationAvailability,
        ),
        fileIdList: formState.basicInfoForm.fileIdList,
        truckColors: formState.basicInfoForm.truckColors,
        bodyType: formState.basicInfoForm.bodyType as TruckBodyType,
        isCatering: Boolean(formState.operationForm.isCatering),
        types: formState.menuForm.types,
        paymentMethods: formState.paymentForm.paymentMethods,
        proofIssuanceTypes: formState.paymentForm.proofIssuanceTypes,
      },
      truckRegionCodeSet: formState.operationForm.regions.map(
        (region) => region.code,
      ),
      truckCategoryCodeSet: formState.menuForm.truckCategoryCodeSet,
      truckMenuDtoList: buildMenuPayload(formState.menuForm),
      truckDocumentDtoSet: buildDocumentPayload(formState.documentForm),
    },
  };

  return { requestBody };
}

export function buildUpdateTruckRequestBody(
  formState: TruckFormStateBundle,
):
  | { requestBody: TruckUpdateRequestBody; errorMessage?: never }
  | { requestBody: null; errorMessage: string } {
  const validationError = validateCommonTruckForm(
    formState.basicInfoForm,
    formState.operationForm,
    formState.menuForm,
    formState.paymentForm,
  );

  if (validationError) {
    return createValidationError(validationError);
  }

  const requestBody: TruckUpdateRequestBody = {
    truckInfoDto: {
      name: formState.basicInfoForm.name.trim(),
      description: formState.basicInfoForm.description.trim(),
      fileIdList: formState.basicInfoForm.fileIdList,
      truckColors: formState.basicInfoForm.truckColors,
      bodyType: formState.basicInfoForm.bodyType as TruckBodyType,
    },
    truckOperationDto: {
      electricityUsage: Boolean(formState.operationForm.electricityUsage),
      gasUsage: Boolean(formState.operationForm.gasUsage),
      selfGenerationAvailability: Boolean(
        formState.operationForm.selfGenerationAvailability,
      ),
      truckRegionCodeSet: formState.operationForm.regions.map(
        (region) => region.code,
      ),
      isCatering: Boolean(formState.operationForm.isCatering),
    },
    truckMenuDto: {
      truckCategoryCodeSet: formState.menuForm.truckCategoryCodeSet,
      types: formState.menuForm.types,
      truckMenuDtoList: buildMenuPayload(formState.menuForm),
    },
    truckPaymentDto: {
      paymentMethods: formState.paymentForm.paymentMethods,
      proofIssuanceTypes: formState.paymentForm.proofIssuanceTypes,
    },
    truckDocumentDtoList: buildDocumentPayload(formState.documentForm),
  };

  return { requestBody };
}
