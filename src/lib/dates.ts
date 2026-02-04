import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

export type Row = {
    id: string;
    fecha: string;
    dow: "viernes" | "sabado";
    recibimiento: string | "";
    matutino: string | "";
    vespertino: string | "";
};

function makeRow(d: Date): Row {
    return {
        id: format(d, "yyyy-MM-dd"),
        fecha: format(d, "MM/dd/yy"),
        dow: d.getDay() === 5 ? "viernes" : "sabado",
        recibimiento: "",
        matutino: "",
        vespertino: "",
    };
}

export function buildRows(year: number, month: number): Row[] {
    const start = startOfMonth(new Date(year, month - 1, 1));
    const end = endOfMonth(start);

    // Fechas del mes
    const days = eachDayOfInterval({ start, end });

    // Viernes y sábado dentro del mes
    const rows = days
    .filter((d) => d.getDay() === 5 || d.getDay() === 6)
    .map(makeRow);

    // Si el mes termina con viernes, agrega el sábado inmediato (día + 1)
    if (rows.length > 0 && rows[rows.length - 1].dow === "viernes") {
        const lastISO = rows[rows.length - 1].id; // yyyy-MM-dd
        const last = new Date(`${lastISO}T12:00:00`); // mediodía evita líos de DST
        const nextDay = new Date(last);
        nextDay.setDate(nextDay.getDate() + 1);
        rows.push(makeRow(nextDay));
    }

    return rows;
}
