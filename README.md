
# coptic-unicode-converter

Converts Coptic non-unicode text to Coptic Unicode.

Coptic Unicode block was added to version 4.1 of the Unicode Standard to write the Coptic language.
More Information:
- [Coptic (Unicode block)](https://en.wikipedia.org/wiki/Coptic_(Unicode_block))
- [Coptic on symbl.cc](https://symbl.cc/en/unicode/blocks/coptic/)


## Installation

```sh
npm install @stmarkus/coptic-font-unicode-converter
```

## Usage

```javascript
import { convertCopticText } from "@stmarkus/coptic-font-unicode-converter";

const copticPhrase = ";Ele;/con ;/mac ;o Yeoc";
const font = "NEW_ATHANASIUS";
const jimkin = "COMBINE_WITH_CHAR_AFTER";

convertCopticText(font, copticPhrase, jimkin);
```

### Supported Coptic Non-Unicode Fonts 

  - CS
  - NEW_ATHANASIUS
  - ATHANASIUS
  - AVVA_SHENOUDA
  - AVVA_MARCOS
  - AVVA_BISHOY
  - BISHOP_TADROS
  - SAINT_ABRAHAM
  - ANTONIOUS
  - ANTONIOUS_THIN
  - ANTONIOUSJ
  - ANTONIOUSOL
  - COPTIC
  - COPTICII
  - COPTONEW
  - KOPTOS
  - SAINTGEORGES
  - KYRILLOS
  - KOPTWI3
  - KPTWI3B
  - AVVA_KYRILLOS
  - SAINT_MARINA
  - SPACHMIM
  - MENA1
  - POPE_SHENOUDA_III
  - NOPHER

### Jimkin combining method

| Method | Notes |
| ------ | ------ |
| COMBINE_WITH_CHAR_BEFORE | The charachter before the Jimkin gets combined |
| COMBINE_WITH_CHAR_AFTER | The charachter after the Jimkin gets combined |
| NONE | No combining method |
