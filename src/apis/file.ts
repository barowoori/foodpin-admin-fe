import api from ".";

export const saveFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const fileId = res.data?.data?.fileId;
  if (!fileId) {
    throw new Error("파일 업로드 응답에 fileId가 없습니다.");
  }

  return fileId;
};
