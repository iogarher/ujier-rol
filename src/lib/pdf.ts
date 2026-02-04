import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { Row } from "./dates";
import { UJIERES, getColor } from "../data/ujieres";

(pdfMake as any).vfs = pdfFonts.vfs;

const BORDER="#C9D1DC";
const HEADER="#E9EDF3";
const BLUE="#1F2F4D";
const MUTED="#6B7280";

function dash(){ return {text:"—",alignment:"center",color:MUTED}; }

function cell(name:string|""){
    return name
    ? {text:name,fillColor:getColor(name),margin:[5,5,5,5]}
    : dash();
}

function legend(){
    return {
        table:{
            widths:["*"],
            body:[
                [{text:"UJIERES",bold:true,alignment:"center",fillColor:HEADER,color:BLUE}],
                ...UJIERES.map(u=>[
                    {
                        columns:[
                            {width:14,canvas:[{type:"rect",x:0,y:2,w:12,h:12,r:2,color:u.color,lineColor:"#999"}]},
                            {width:"*",text:u.nombre,margin:[6,0,0,0]}
                        ],
                        margin:[6,4,6,4]
                    }
                ])
            ]
        },
        layout:{hLineColor:()=>BORDER,vLineColor:()=>BORDER}
    };
}

export function downloadRolPdf(year:number,monthName:string,rows:Row[]){
    const body=[
        [
            {text:"FECHA",bold:true,alignment:"center",color:BLUE},
            {text:"RECIBIMIENTO (VIERNES)",bold:true,alignment:"center",color:BLUE},
            {text:"MATUTINO (SÁBADO)",bold:true,alignment:"center",color:BLUE},
            {text:"VESPERTINO (SÁBADO)",bold:true,alignment:"center",color:BLUE},
        ],
        ...rows.map(r=>{
            const fri=r.dow==="viernes";
            return[
                {text:r.fecha,bold:true,alignment:"center",color:BLUE},
                fri?cell(r.recibimiento):dash(),
                    !fri?cell(r.matutino):dash(),
                    !fri?cell(r.vespertino):dash(),
            ];
        })
    ];

    pdfMake.createPdf({
        pageSize:"LETTER",
        pageOrientation:"landscape", // ⭐ horizontal
        pageMargins:[36,36,36,36],
        content:[
            {text:`PROGRAMA DE UJIER – ${monthName} ${year}`,alignment:"center",fontSize:18,bold:true,color:BLUE,margin:[0,0,0,12]},
            {
                columns:[
                    {width:"*",table:{headerRows:1,widths:[60,"*","*","*"],body},
                    layout:{fillColor:(i)=>i===0?HEADER:null,hLineColor:()=>BORDER,vLineColor:()=>BORDER}
                    },
                    {width:14,text:""},
                    {width:200, ...legend()}
                ]
            }
        ],
        defaultStyle:{fontSize:11}
    }).download(`PROGRAMA_DE_UJIER_${monthName}_${year}.pdf`);
}
