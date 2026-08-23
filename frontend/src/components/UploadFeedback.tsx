import type { UploadResult, UploadStatus } from "../types/upload";

interface UploadFeedbackProps {
  file: File | null;
  result: UploadResult | null;
  status: UploadStatus;
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

export function UploadFeedback({
  file,
  result,
  status,
}: UploadFeedbackProps) {
  if (status === "selected" && file) {
    return (
      <div className="file-summary">
        <strong>{file.name}</strong>
        <span>{formatFileSize(file.size)} · Archivo .xlsx válido</span>
      </div>
    );
  }

  if (status === "uploading" && file) {
    return (
      <div className="file-summary">
        <strong>Cargando usuarios...</strong>
        <span>Validando registros de {file.name}</span>
      </div>
    );
  }

  if ((status === "success" || status === "warning") && result) {
    const omitted =
      result.duplicated_records +
      result.underage_records +
      result.invalid_email_records;

    return (
      <div className="file-summary">
        <strong>{result.inserted_records} usuarios cargados</strong>
        <span>
          {omitted === 0
            ? "Todos los registros se procesaron correctamente"
            : `${omitted} registros fueron omitidos`}
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="file-summary">
        <strong>No pudimos procesar el archivo</strong>
        <span>Revisa las columnas requeridas y vuelve a intentarlo</span>
      </div>
    );
  }

  return (
    <div className="file-summary">
      <strong>Sube tu archivo</strong>
      <span>Formatos admitidos: .xlsx · Máximo 10 MB</span>
    </div>
  );
}
