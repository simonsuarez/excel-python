export type UploadStatus =
  | "idle"
  | "selected"
  | "uploading"
  | "success"
  | "warning"
  | "error";

export interface UploadResult {
  inserted_records: number;
  duplicated_records: number;
  underage_records: number;
  invalid_email_records: number;
  all_records: number;
}

export interface ApiError {
  status: "error";
  detail?: string;
}
