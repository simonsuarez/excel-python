import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ExcelPython", () => {
  it("habilita la carga al seleccionar un archivo xlsx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
    );
    render(<App />);

    const input = screen.getByLabelText("Seleccionar archivo Excel");
    const file = new File(["contenido"], "usuarios.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("usuarios.xlsx")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cargar usuarios" })).toBeEnabled();
  });

  it("muestra observaciones cuando la API omite registros", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            inserted_records: 15,
            duplicated_records: 2,
            underage_records: 1,
            invalid_email_records: 2,
            all_records: 20,
          }),
          { status: 200 },
        ),
      );
    render(<App />);

    const file = new File(["contenido"], "usuarios.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fireEvent.change(screen.getByLabelText("Seleccionar archivo Excel"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cargar usuarios" }));

    await waitFor(() => {
      expect(screen.getByText("15 usuarios cargados")).toBeInTheDocument();
    });
    expect(
      screen.getByText("2 duplicados · 1 menor · 2 emails inválidos"),
    ).toBeInTheDocument();
  });
});
