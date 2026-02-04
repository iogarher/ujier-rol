export type Ujier = { nombre: string; color: string };

export const UJIERES: Ujier[] = [
    { nombre: "Hno. Erick", color: "#FFFF00" },
    { nombre: "Hno. Gabriel", color: "#FF8000" },
    { nombre: "Hno. Harim", color: "#77BC65" },
    { nombre: "Hno. José", color: "#E16173" },
    { nombre: "Hno. Melvin", color: "#A1467E" },
    { nombre: "Hno. Saúl", color: "#ED4C05" },
    { nombre: "Ob. David", color: "#00A933" },
    { nombre: "Ob. Donaldo", color: "#FFBF00" },
    { nombre: "Diác. Franklin", color: "#813709" },
    { nombre: "Ob. Iovanni", color: "#BBE33D" },
    { nombre: "Ob. Israel", color: "#3465A4" },
    { nombre: "Ob. Luis", color: "#81ACA6" },
    { nombre: "Ob. Matilde", color: "#B47804" },
    { nombre: "Ob. Saúl", color: "#224B12" }
];

export const getColor = (n: string | "") =>
UJIERES.find(u => u.nombre === n)?.color ?? "#FFFFFF";

export function getTextColor(bgColor: string) {
    // Quita el # si existe
    const c = bgColor.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);

    // fórmula luminancia
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 160 ? "#1A1A1A" : "#FFFFFF";
}

