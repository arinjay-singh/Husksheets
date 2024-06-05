/**
 * @file cell-referencing.ts
 * @brief A function to convert a cell reference to a row and column index.
 * @version 1.0
 * @date 06-03-2024
 * @author Arinjay Singh
 */

// function to convert a cell reference code to a row and column index
// returns a 0-indexed row and column index
export const cellMap = (cell: string): [number, number] => {
  // uppercase the cell reference
  const cellUpper = cell.toUpperCase();

  // extract column from letters
  const letterMatch = cellUpper.match(/[A-Z]+/);
  const letter = letterMatch ? letterMatch[0] : "";

  // extract row from numbers
  const numberMatch = cell.match(/\d+/);
  const row = numberMatch ? parseInt(numberMatch[0]) : 0;

  // convert column letter to index
  const col = letter.split("").reduce((acc, char) => {
    return acc * 26 + char.toUpperCase().charCodeAt(0) - 64;
  }, 0);

  // return 0-indexed row and column index
  return [row - 1, col - 1];
};

export const retrieveCellValue = (
  data: string[][],
  coord: [number, number]
) => {
  return data[coord[0]][coord[1]];
};

export const parseCellReferences = (data: string[][], expression: string) => {
  return expression.replace(/\$[a-zA-Z]\d+/g, (match) => {
    try {
      const cellReference = match.slice(1);
      const cellCoords = cellMap(cellReference);
      const cellValue = retrieveCellValue(data, cellCoords);
      return cellValue;
    } catch (e) {
      alert("Error: Invalid cell reference");
      return match;
    }
  });
};
