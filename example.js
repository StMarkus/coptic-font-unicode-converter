import {
  jimkinMethodValid,
  getJimkinCombiningMethods,
  fontSupported,
  getSupportedCopticFonts,
  convertCopticText,
} from "./index.mjs";

const supported = await fontSupported("NEW_ATHANASIUS");
console.log("Supported: ", supported);

const fonts = await getSupportedCopticFonts();
console.log("Fonts: ", fonts);

const jMethod = jimkinMethodValid("NONE");
console.log("jMethod: ", jMethod);

const jMethods = getJimkinCombiningMethods();
console.log("jMethods: ", jMethods);

const copticPhrase = ";Ele;/con ;/mac ;o Yeoc";
const font = "NEW_ATHANASIUS";
const jimkin = "COMBINE_WITH_CHAR_AFTER";
const convertedText = await convertCopticText(font, copticPhrase, jimkin);
console.log("convertedText: ", convertedText);
