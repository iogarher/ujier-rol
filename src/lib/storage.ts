import type { Row } from "./dates";

const key = (y:number,m:number)=>`ujier-rol:${y}-${m}`;

export const loadMonth = (y:number,m:number) =>
JSON.parse(localStorage.getItem(key(y,m))||"null");

export const saveMonth = (y:number,m:number,r:Row[]) =>
localStorage.setItem(key(y,m), JSON.stringify(r));

export const clearMonth = (y:number,m:number)=>
localStorage.removeItem(key(y,m));
