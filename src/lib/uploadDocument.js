import api from "./api";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

export async function uploadDocument(file) {
  if (!file) throw new Error("Choose a PDF first");

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF documents can be uploaded here");
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Documents must be 5 MB or smaller");
  }

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData);
  return data.url;
}
