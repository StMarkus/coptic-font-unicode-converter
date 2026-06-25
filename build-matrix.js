import ExcelJS from "exceljs";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COPTIC_FONT_COL_START = 6;
const COPTIC_FONT_COL_END = 34;
const COPTIC_FONT_ROW_START = 2;
const COPTIC_FONT_ROW_END = 113;
const COPTIC_FONT_UNICODE_COL = 5;

const EXCEL_FILE = path.join(__dirname, "all2Unicode_v3.xlsx");
const OUT_FILE = path.join(__dirname, "fontMatrix.json");
const SHEETNAME = "mapping";

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(EXCEL_FILE);
const worksheet = workbook.getWorksheet(SHEETNAME);

const matrix = {};
for (let colInd = COPTIC_FONT_COL_START; colInd < COPTIC_FONT_COL_END; colInd++) {
  const fontName = worksheet.getRow(1).getCell(colInd).value;
  if (fontName === null || fontName === "") continue;
  const rowData = {};
  for (let rowInd = COPTIC_FONT_ROW_START; rowInd < COPTIC_FONT_ROW_END; rowInd++) {
    const unicodeVal = worksheet.getRow(rowInd).getCell(COPTIC_FONT_UNICODE_COL).value;
    const fontChar = worksheet.getRow(rowInd).getCell(colInd).value;
    if (fontChar !== "" && unicodeVal !== "" && fontChar != null && unicodeVal != null) {
      rowData[fontChar] = unicodeVal;
    }
  }
  matrix[fontName] = rowData;
}

writeFileSync(OUT_FILE, JSON.stringify(matrix, null, 2));
console.log(`Wrote ${Object.keys(matrix).length} fonts to ${OUT_FILE}`);
