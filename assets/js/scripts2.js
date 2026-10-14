import { format } from "date-fns";

let dataOrig = new Date(2014, 1, 11); // 11 de fevereiro de 2014

let data1 = format(dataOrig, "yyyy-MM-dd");
let data2 = format(dataOrig, "dd/MM/yyyy");

console.log(data1);
console.log(data2);
