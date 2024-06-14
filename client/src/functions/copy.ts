/**
 * @file copy.ts
 * @brief This file defines the parseCopy function, which is used to parse the COPY function in the spreadsheet.
 * @date 06-13-2024
 * @author Arinjay Singh
 */

import { cellMap } from "./cell-referencing";

export const parseCopy = (
  data: string[][],
  input: string,
  currentCoords: [number, number]
): [string, string, number[][]] | null => {
  console.log("parseCopy");
  input = input.replace(/\s/g, "");
  console.log("input", input);
  const copyPattern = /^=COPY\(\$(\w+\d+),\s*"\$(\w+\d+)"\)$/;

  const match = input.match(copyPattern);

  if (!match) {
    return null;
  }

  const [, copy, paste] = match;
  const copyCoords = cellMap(copy);
  const copyValue = data[copyCoords[0]][copyCoords[1]];
  const pasteCoords = cellMap(paste);

  console.log(copy, pasteCoords);
  if (copyCoords[0] === currentCoords[0] && copyCoords[1] === currentCoords[1]) {
    return [`=$${copy}`, copyValue, [pasteCoords]];
  }
  return [`=$${copy}`, copyValue, [pasteCoords, currentCoords]];
  
};

export default parseCopy;
