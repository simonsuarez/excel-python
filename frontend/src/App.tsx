import { useEffect, useMemo, useState } from "react";
import { ApiStatus } from "./components/ApiStatus";
import { Brand } from "./components/Brand";
import { UploadDropzone } from "./components/UploadDropzone";
import { UploadFeedback } from "./components/UploadFeedback";
import { ValidationSummary } from "./components/ValidationSummary";
import { checkApiHealth, uploadUsersExcel } from "./services/usersApi";
import type { UploadResult, UploadStatus } from "./types/upload";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function App() {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  useEffect(() => {
    const controller = new AbortController();

    const updateApiStatus = async () => {
      const connected = await checkApiHealth(controller.signal);
      if (!controller.signal.aborted) {
        setApiConnected(connected);
      }
    };

    void updateApiStatus();
    const intervalId = window.setInterval(updateApiStatus, 10_000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const buttonLabel = useMemo(() => {
    if (status === "uploading") return "Cargando...";
    if (status === "success" || status === "warning") {
      return "Cargar otro archivo";
    }
    if (status === "error") return "Seleccionar otro archivo";
    if (status === "selected") return "Cargar usuarios";
    return "Cargar datos";
  }, [status]);

  const validateFile = (selectedFile: File) => {
    setResult(null);

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      setFile(null);
      setStatus("error");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setStatus("error");
      return;
    }

    setFile(selectedFile);
    setStatus("selected");
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
  };

  const handlePrimaryAction = async () => {
    if (status === "success" || status === "warning" || status === "error") {
      resetUpload();
      return;
    }

    if (!file || status !== "selected") return;

    setStatus("uploading");

    try {
      const uploadResult = await uploadUsersExcel(file);
      const omitted =
        uploadResult.duplicated_records +
        uploadResult.underage_records +
        uploadResult.invalid_email_records;

      setResult(uploadResult);
      setStatus(omitted > 0 ? "warning" : "success");
      setApiConnected(true);
    } catch {
      setResult(null);
      setStatus("error");
    }
  };

  const isUploading = status === "uploading";
  const canSubmit = status === "selected" && file !== null;

  return (
    <div className="app-shell">
      <header className="site-header">
        <Brand />
        <ApiStatus connected={apiConnected} />
      </header>

      <main id="main-content" className="main-content">
        <section className="hero" aria-labelledby="page-title">
          <span className="hero__eyebrow">Importación inteligente</span>
          <h1 id="page-title">Convierte tu Excel en datos útiles</h1>
          <p>
            Carga tu archivo y deja que ExcelPython valide y registre los datos
            de forma segura.
          </p>
        </section>

        <section className="upload-card" aria-labelledby="upload-title">
          <div id="upload-title">
            <UploadFeedback file={file} result={result} status={status} />
          </div>

          <UploadDropzone
            disabled={isUploading}
            onFileSelected={validateFile}
          />

          <div className="upload-actions">
            <ValidationSummary result={result} status={status} />
            <button
              className="primary-button"
              type="button"
              onClick={handlePrimaryAction}
              disabled={status === "idle" || isUploading}
            >
              {isUploading && <span className="spinner" aria-hidden="true" />}
              {buttonLabel}
            </button>
          </div>
        </section>

        <p className="security-note">
          <span aria-hidden="true">✓</span>
          Conexión segura · El archivo se procesa únicamente para registrar tus
          datos
        </p>
      </main>
    </div>
  );
}

export default App;
