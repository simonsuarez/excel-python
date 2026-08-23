import type { UploadResult, UploadStatus } from "../types/upload";

interface ValidationSummaryProps {
  result: UploadResult | null;
  status: UploadStatus;
}

export function ValidationSummary({
  result,
  status,
}: ValidationSummaryProps) {
  let message = "Validaremos las columnas antes de guardar";

  if (status === "selected") message = "Archivo listo para cargar";
  if (status === "uploading") message = "No cierres esta ventana";
  if (status === "success" && result) {
    message = `${result.inserted_records} de ${result.all_records} registros insertados`;
  }
  if (status === "warning" && result) {
    const duplicatedLabel =
      result.duplicated_records === 1 ? "duplicado" : "duplicados";
    const underageLabel =
      result.underage_records === 1 ? "menor" : "menores";
    const invalidEmailLabel =
      result.invalid_email_records === 1
        ? "email inválido"
        : "emails inválidos";

    message = `${result.duplicated_records} ${duplicatedLabel} · ${result.underage_records} ${underageLabel} · ${result.invalid_email_records} ${invalidEmailLabel}`;
  }
  if (status === "error") {
    message = "Corrige el Excel y selecciónalo nuevamente";
  }

  return (
    <div className={`validation validation--${status}`} role="status" aria-live="polite">
      <span className="validation__icon" aria-hidden="true">
        {status === "warning" || status === "error" ? "!" : "✓"}
      </span>
      <span>{message}</span>
    </div>
  );
}
