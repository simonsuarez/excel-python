import type { ApiError, UploadResult } from "../types/upload";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

export async function checkApiHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal });
    return response.ok;
  } catch {
    return false;
  }
}

export async function uploadUsersExcel(
  file: File,
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("path", file);

  const response = await fetch(`${API_BASE_URL}/users/cargar_excel`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("La API no pudo procesar la solicitud.");
  }

  const data = (await response.json()) as UploadResult | ApiError;

  if ("status" in data) {
    throw new Error(data.detail || "El archivo no pudo ser procesado.");
  }

  return data;
}
