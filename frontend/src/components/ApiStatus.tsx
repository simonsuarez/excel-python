interface ApiStatusProps {
  connected: boolean | null;
}

export function ApiStatus({ connected }: ApiStatusProps) {
  const label =
    connected === null
      ? "Comprobando API"
      : connected
        ? "API conectada"
        : "API sin conexión";

  return (
    <div
      className={`api-status ${connected === false ? "api-status--offline" : ""}`}
      role="status"
    >
      <span className="api-status__dot" aria-hidden="true" />
      {label}
    </div>
  );
}
