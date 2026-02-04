import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { UJIERES, getColor, getTextColor } from "./data/ujieres";
import { buildRows, type Row } from "./lib/dates";
import { clearMonth, loadMonth, saveMonth } from "./lib/storage";
import { downloadRolPdf } from "./lib/pdf";

function monthNameES(m: number) {
  return [
    "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE",
  ][m - 1];
}

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const template = useMemo(() => buildRows(year, month), [year, month]);
  const [rows, setRows] = useState<Row[]>(template);

  // load or reset on month/year change
  useEffect(() => {
    const saved = loadMonth(year, month);
    setRows(saved ?? template);
  }, [year, month, template]);

  // autosave
  useEffect(() => {
    saveMonth(year, month, rows);
  }, [year, month, rows]);

  const title = `PROGRAMA DE UJIER – ${monthNameES(month)} ${year}`;

  const missing = useMemo(() => {
    let m = 0;
    for (const r of rows) {
      if (r.dow === "viernes") {
        if (!r.recibimiento) m++;
      } else {
        if (!r.matutino) m++;
        if (!r.vespertino) m++;
      }
    }
    return m;
  }, [rows]);

  function setRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function resetMonth() {
    clearMonth(year, month);
    setRows(template);
  }

  return (
    <div className="page">
    <div className="card">
    <div className="header">
    <div>
    <h1>{title}</h1>
    <p className="sub">
    Asignación manual. {missing > 0 ? (
      <span className="warn">Faltan {missing} selecciones.</span>
    ) : (
      <span className="ok">Todo listo ✅</span>
    )}
    </p>
    </div>

    <div className="actions">
    <button className="btn" onClick={resetMonth}>Limpiar</button>
    <button
    className="btn primary"
    onClick={() => downloadRolPdf(year, monthNameES(month), rows)}
    >
    Descargar PDF
    </button>
    </div>
    </div>

    <div className="controls">
    <label>
    Mes
    <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
    {Array.from({ length: 12 }).map((_, i) => {
      const m = i + 1;
      return <option key={m} value={m}>{monthNameES(m)}</option>;
    })}
    </select>
    </label>

    <label>
    Año
    <input type="number" value={year} min={2000} max={2100} onChange={(e) => setYear(Number(e.target.value))} />
    </label>
    </div>

    <div className="layout">
    <div className="tableWrap">
    <table className="table">
    <thead>
    <tr>
    <th className="dateCol">FECHA</th>
    <th>RECIBIMIENTO (VIERNES)</th>
    <th>MATUTINO (SÁBADO)</th>
    <th>VESPERTINO (SÁBADO)</th>
    </tr>
    </thead>
    <tbody>
    {rows.map((r) => {
      const isFri = r.dow === "viernes";
      return (
        <tr key={r.id}>
        <td className="dateCell">
        {r.fecha}
        <div className="dow">{isFri ? "Vie" : "Sáb"}</div>
        </td>

        {/* Recibimiento */}
        <td>
        {isFri ? (
          <select
          className="sel"
          value={r.recibimiento}
          onChange={(e) => setRow(r.id, { recibimiento: e.target.value })}
          style={{
            backgroundColor: getColor(r.recibimiento),
                  color: getTextColor(getColor(r.recibimiento)),
                  fontWeight: 600,
          }}
          >
          <option value="">— Seleccionar —</option>
          {UJIERES.map((u) => <option key={u.nombre} value={u.nombre}>{u.nombre}</option>)}
          </select>
        ) : (
          <div className="na">—</div>
        )}
        </td>

        {/* Matutino */}
        <td>
        {!isFri ? (
          <select
          className="sel"
          value={r.matutino}
          onChange={(e) => setRow(r.id, { matutino: e.target.value })}
          style={{
            backgroundColor: getColor(r.matutino),
                   color: getTextColor(getColor(r.matutino)),
                   fontWeight: 600,
          }}
          >
          <option value="">— Seleccionar —</option>
          {UJIERES.map((u) => <option key={u.nombre} value={u.nombre}>{u.nombre}</option>)}
          </select>
        ) : (
          <div className="na">—</div>
        )}
        </td>

        {/* Vespertino */}
        <td>
        {!isFri ? (
          <select
          className="sel"
          value={r.vespertino}
          onChange={(e) => setRow(r.id, { vespertino: e.target.value })}
          style={{
            backgroundColor: getColor(r.vespertino),
                   color: getTextColor(getColor(r.vespertino)),
                   fontWeight: 600,
          }}
          >
          <option value="">— Seleccionar —</option>
          {UJIERES.map((u) => <option key={u.nombre} value={u.nombre}>{u.nombre}</option>)}
          </select>
        ) : (
          <div className="na">—</div>
        )}
        </td>
        </tr>
      );
    })}
    </tbody>
    </table>
    </div>

    {/* Leyenda derecha */}
    <aside className="legend">
    <div className="legendTitle">UJIERES</div>
    {UJIERES.map((u) => (
      <div key={u.nombre} className="legItem">
      <span className="swatch" style={{ background: u.color }} />
      <span>{u.nombre}</span>
      </div>
    ))}
    </aside>
    </div>

    <p className="hint">
    Nota: Se guarda automáticamente en este dispositivo (localStorage). Para compartir, descarga el PDF.
    </p>
    </div>
    </div>
  );
}
