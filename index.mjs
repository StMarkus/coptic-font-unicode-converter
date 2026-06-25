import { JimkinCombining, switchCharForJimkin } from "./Jimkin.js";
import { removeCharAfterOverline } from "./Overline.js";
import fontMatrixJson from "./fontMatrix.json" with { type: "json" };

const fontMatrix = new Map(
  Object.entries(fontMatrixJson).map(([fontName, chars]) => [
    fontName,
    new Map(Object.entries(chars)),
  ])
);

/**
 * check if provided coptic non-unicode font is valid
 */
export async function fontSupported(fontToCheck) {
  return fontMatrix.has(fontToCheck);
}

/**
 * returns a list of supported non-unicode fonts which can be converted to unicode
 */
export async function getSupportedCopticFonts() {
  return fontMatrix.keys();
}

/**
 * check if provided jimkin combining method is valid
 */
export function jimkinMethodValid(jimkin) {
  if (
    jimkin !== JimkinCombining.NONE &&
    jimkin !== JimkinCombining.COMBINE_WITH_CHAR_BEFORE &&
    jimkin !== JimkinCombining.COMBINE_WITH_CHAR_AFTER
  ) {
    console.error(
      `Provided jimkin combining method ${jimkin} is not supported!`
    );
    console.log("Supported Methods: ", JimkinCombining);
    return false;
  }
  return true;
}

/**
 * returns a list of valid jimkin combining methods
 */
export function getJimkinCombiningMethods() {
  return JimkinCombining;
}

/**
 * converts the given string into coptic unicode characters
 */
export async function convertCopticText(font, copticPhrase, jimkin) {
  const fontMap = fontMatrix.get(font);
  if (!fontMap) return "";

  let sb = [];
  for (let i = 0; i < copticPhrase.length; i++) {
    const copticChar = copticPhrase.charAt(i);
    if (copticChar === " ") {
      sb.push(" ");
      continue;
    }
    const converted = fontMap.get(copticChar);
    if (converted !== undefined) {
      sb.push(converted);
    }
  }

  let postJimkinCombining;
  if (jimkin !== JimkinCombining.NONE) {
    postJimkinCombining = switchCharForJimkin(sb.join(""), jimkin);
  } else {
    postJimkinCombining = sb.join("");
  }

  return removeCharAfterOverline(postJimkinCombining);
}
