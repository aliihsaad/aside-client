import api from "./api";

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

const ALLOWED_IMAGE_TYPES = new Set(IMAGE_ACCEPT.split(","));
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) throw new Error("Choose an image first");

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a PNG, JPG, WebP, or GIF image");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Images must be 5 MB or smaller");
  }
}

export async function uploadImage(file) {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData);
  return data.url;
}
