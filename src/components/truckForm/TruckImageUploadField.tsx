import { useEffect, useMemo, useRef, useState } from "react";
import { saveFile } from "../../apis";
import Button from "../Button";
import { FormInput } from "../form";

type TruckImageUploadFieldProps = {
  fileIdList: string[];
  photoFiles: File[];
  photoPaths: string[];
  onChange: (next: {
    fileIdList: string[];
    photoFiles: File[];
    photoPaths: string[];
  }) => void;
  maxCount?: number;
  accept?: string;
  previewEnabled?: boolean;
  helperText?: string;
};

function TruckImageUploadField({
  fileIdList,
  photoFiles,
  photoPaths,
  onChange,
  maxCount = 10,
  accept = "image/*",
  previewEnabled = true,
  helperText,
}: TruckImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const localPreviewUrls = useMemo(
    () =>
      previewEnabled
        ? photoFiles.map((file) => URL.createObjectURL(file))
        : [],
    [photoFiles, previewEnabled],
  );
  const previewUrls = useMemo(
    () => [...photoPaths, ...localPreviewUrls],
    [localPreviewUrls, photoPaths],
  );
  const isLimitReached = fileIdList.length >= maxCount;
  const selectedFileLabel =
    fileIdList.length > 0 ? `${fileIdList.length}개 파일 선택` : "선택된 파일 없음";

  useEffect(() => {
    return () => {
      localPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [localPreviewUrls]);

  const handleRemove = (index: number) => {
    const serverPhotoCount = photoPaths.length;
    const serverFileIds = fileIdList.slice(0, serverPhotoCount);
    const localFileIds = fileIdList.slice(serverPhotoCount);

    if (index < serverPhotoCount) {
      onChange({
        photoPaths: photoPaths.filter((_, itemIndex) => itemIndex !== index),
        photoFiles,
        fileIdList: [
          ...serverFileIds.filter((_, itemIndex) => itemIndex !== index),
          ...localFileIds,
        ],
      });
      return;
    }

    const localIndex = index - serverPhotoCount;
    onChange({
      photoPaths,
      photoFiles: photoFiles.filter((_, itemIndex) => itemIndex !== localIndex),
      fileIdList: [
        ...serverFileIds,
        ...localFileIds.filter((_, itemIndex) => itemIndex !== localIndex),
      ],
    });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={async (event) => {
          const selectedFiles = Array.from(event.target.files ?? []);
          event.target.value = "";

          if (selectedFiles.length === 0) {
            return;
          }

          const remainingCount = maxCount - fileIdList.length;
          if (remainingCount <= 0) {
            alert(`최대 ${maxCount}개까지 업로드할 수 있습니다.`);
            return;
          }

          const files = selectedFiles.slice(0, remainingCount);
          if (files.length < selectedFiles.length) {
            alert(`최대 ${maxCount}개까지 업로드할 수 있습니다.`);
          }

          setIsUploading(true);

          try {
            const uploadedFileIds = await Promise.all(files.map((file) => saveFile(file)));
            onChange({
              photoFiles: [...photoFiles, ...files],
              photoPaths,
              fileIdList: [...fileIdList, ...uploadedFileIds],
            });
          } catch (error) {
            console.error("Failed to upload files", error);
            alert("파일 업로드에 실패했습니다.");
          } finally {
            setIsUploading(false);
          }
        }}
      />

      {previewEnabled && previewUrls.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {previewUrls.map((photoUrl, index) => (
            <div
              key={`${photoUrl}-${index}`}
              className="border-border-control relative h-28 w-42 overflow-hidden rounded-md border bg-[#1f2329]"
            >
              <img
                src={photoUrl}
                alt={`업로드 이미지 ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-black/65 text-[16px] leading-none font-medium text-white hover:bg-black/80"
                aria-label={`이미지 ${index + 1} 삭제`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <FormInput readOnly value={selectedFileLabel} className="w-full max-w-80" />
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || isLimitReached}
          className="h-11 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
        >
          {isUploading ? "업로드 중..." : "파일 찾기"}
        </Button>
      </div>

      <p className="text-fg-muted text-xs">
        {helperText ?? `최대 ${maxCount}개까지 업로드할 수 있습니다.`}
      </p>
    </div>
  );
}

export default TruckImageUploadField;
