import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface UploadDropzoneProps {
  disabled: boolean;
  onFileSelected: (file: File) => void;
}

export function UploadDropzone({
  disabled,
  onFileSelected,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const chooseFile = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    if (!disabled) {
      const file = event.dataTransfer.files?.[0];
      if (file) {
        onFileSelected(file);
      }
    }
  };

  return (
    <div
      className={`dropzone ${dragging ? "dropzone--dragging" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleChange}
        disabled={disabled}
        aria-label="Seleccionar archivo Excel"
      />
      <span className="dropzone__icon" aria-hidden="true">
        ↑
      </span>
      <strong>Arrastra tu Excel aquí</strong>
      <span>o selecciona un archivo desde tu equipo</span>
      <button
        className="secondary-button"
        type="button"
        onClick={chooseFile}
        disabled={disabled}
      >
        Seleccionar archivo
      </button>
    </div>
  );
}
