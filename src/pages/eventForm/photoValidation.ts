export const MAX_EVENT_PHOTO_COUNT = 10;

export function getMaxPhotoCountMessage(maxCount = MAX_EVENT_PHOTO_COUNT) {
  return `행사 사진은 최대 ${maxCount}개까지 업로드할 수 있습니다.`;
}
