import ExcelJS from "exceljs";
import path from 'path';
import { fileURLToPath } from 'url';
import { JimkinCombining, switchCharForJimkin } from "./Jimkin.js";

// to reference the excel-file correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONSTANTS
const COPTIC_FONT_COL_START = 6;
const COPTIC_FONT_COL_END = 32;
const COPTIC_FONT_ROW_START = 2;
const COPTIC_FONT_ROW_END = 109;
const COPTIC_FONT_UNICODE_COL = 5;
const COPTIC_CHAR_COL_START = 1;
const COPTIC_CHAR_COL_END = 6;
const COPTIC_CHAR_ROW_START = 2;
const COPTIC_CHAR_ROW_END = 112;
const COPTIC_CHAR_KEY_COL = 2;

const WORKBOOK = new ExcelJS.Workbook();
const EXCEL_FILE = __dirname + "/all2Unicode.xlsx";
const SHEETNAME = "mapping";

/**
 * currently this one huge method. Needs to be refactored and outsource methods which read the excel sheet.
 * Currently I was not able to do so, because importing async methods and calling them did not work properly
 *
 * @param {*} font
 * @param {*} copticPhrase
 * @param {*} jimkin
 */
function convertCopticText(font, copticPhrase, jimkin) {
  // Load the workbook from a file
  WORKBOOK.xlsx
    .readFile(EXCEL_FILE)
    .then(() => {
      const worksheet = WORKBOOK.getWorksheet(SHEETNAME);

      //
      // Read CopticFontMatrix
      //
      let copticFontsMap = new Map();
      for (
        let colInd = COPTIC_FONT_COL_START;
        colInd < COPTIC_FONT_COL_END;
        colInd++
      ) {
        let fontName = worksheet.getRow(1).getCell(colInd).value;
        // create a map to hold the column data for this row
        let rowData = new Map();

        // loop through the columns of the row
        for (
          let rowInd = COPTIC_FONT_ROW_START;
          rowInd < COPTIC_FONT_ROW_END;
          rowInd++
        ) {
          let unicodeVal = worksheet
            .getRow(rowInd)
            .getCell(COPTIC_FONT_UNICODE_COL).value;
          let fontChar = worksheet.getRow(rowInd).getCell(colInd).value;
          if ((fontChar !== "") & (!unicodeVal !== "")) {
            rowData.set(fontChar, unicodeVal);
          }
          if (fontName !== null && !fontName == "" && rowData != null) {
            copticFontsMap.set(fontName, rowData);
          }
        }
      }
      // console.log("copticFontsMap.size: ", copticFontsMap.size);

      //
      // INPUT CHECKS
      //
      // check if specified font is valid
      if (copticFontsMap.get(font) === undefined) {
        console.error(`Provided font ${font} is not supported!`);
        console.log("Supported Fonts: ", copticFontsMap.keys());
        return;
      }
      // check if specified jimkin-combining-method is valid
      if (
        jimkin !== JimkinCombining.NONE &&
        jimkin !== JimkinCombining.COMBINE_WITH_CHAR_BEFORE &&
        jimkin !== JimkinCombining.COMBINE_WITH_CHAR_AFTER
      ) {
        console.error(
          `Provided jimkin combining method ${jimkin} is not supported!`
        );
        console.log("Supported Methods: ", JimkinCombining);
        return;
      }

      //
      // Read copticCharMatrix
      //
      let copticCharMatrix = new Map();
      // loop through the rows of the sheet
      for (
        let rowInt = COPTIC_CHAR_ROW_START;
        rowInt < COPTIC_CHAR_ROW_END;
        rowInt++
      ) {
        let row = worksheet.getRow(rowInt);

        // get the key for this row
        let key = row.getCell(COPTIC_CHAR_KEY_COL).value;
        if (key == null) {
          key = "";
        }

        // create a map to hold the column data for this row
        let rowData = new Map();
        // loop through the columns of the row
        for (
          let col = COPTIC_CHAR_COL_START;
          col < COPTIC_CHAR_COL_END;
          col++
        ) {
          let value = row.getCell(col).value;
          if (value == null) {
            value = "";
          }
          let column = worksheet.getRow(1).getCell(col).value;
          // console.log(`key: ${key} \tvalue: ${value} \tcol: ${column}`);
          rowData.set(column, value);
          if (key != "") {
            copticCharMatrix.set(key, rowData);
          }
        }
      }
      // console.log("copticCharMatrix.size: ", copticCharMatrix.size);

      //
      // Traverse the string
      //
      let sb = [];
      let converted = "";
      for (let i = 0; i < copticPhrase.length; i++) {
        let copticChar = copticPhrase.charAt(i);
        if (copticChar == " ") {
          sb.push(" ");
          continue;
        }
        converted = copticFontsMap.get(font).get(copticChar + "");
        if (converted !== undefined) {
          sb.push(converted);
        }
      }

      // Jimkin combining
      let finalResult = "";
      if (jimkin !== JimkinCombining.NONE) {
        finalResult = switchCharForJimkin(sb.join(""), jimkin);
      } else {
        finalResult = sb.join("");
      }
      console.log(finalResult);
    })
    .catch((error) => {
      console.error("Error reading Excel file:", error.message);
    });
}

export default convertCopticText;
