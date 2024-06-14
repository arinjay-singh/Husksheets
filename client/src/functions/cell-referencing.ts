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

// function to retrieve the value of a cell from a 2D array
export const retrieveCellValue = (
  data: string[][],
  coord: [number, number]
) => {
  return data[coord[0]][coord[1]];
};

// function to parse cell references in a string
export const parseCellReferences = (data: string[][], expression: string) => {
  // map cell references to values and replace them in the expression
  return expression.replace(/\$[a-zA-Z]\d+/g, (match) => {
    try {
      const cellReference = match.slice(1);
      const cellCoords = cellMap(cellReference);
      const cellValue = retrieveCellValue(data, cellCoords);
      return cellValue;
    } catch (e) {
      // if the cell reference is invalid, return the match and alert the user
      alert("Error: Invalid cell reference");
      return match;
    }
  });
};

// function to retrieve the values for a range of cells given a start and end cell
export const retrieveCellRangeValues = (
  startCell: string,
  endCell: string,
  data: string[][]
) => {
  // get the start and end cell coordinates
  const startCoords = cellMap(startCell);
  const endCoords = cellMap(endCell);

  // get the range of cells
  const cellRangeValues = [];
  for (let i = startCoords[0]; i <= endCoords[0]; i++) {
    for (let j = startCoords[1]; j <= endCoords[1]; j++) {
      try {
        if (data[i][j] !== undefined) {
          cellRangeValues.push(data[i][j]);
        }
      } catch (e) {
        alert("Error: Invalid cell reference");
        return "";
      }
    }
  }

  // return the range of cell values as comma-separated strings
  let cellRangeString = "";
  for (let i = 0; i < cellRangeValues.length; i++) {
    cellRangeString += cellRangeValues[i];
    if (i < cellRangeValues.length - 1) {
      cellRangeString += ",";
    }
  }
  return cellRangeString;
};

export const replaceCellRangesWithValues = (
  data: string[][],
  input: string
): string => {
  input = input.replace(/\s/g, "");
  // Regular expression to match the pattern "$A1:$B4"
  const cellRangePattern = /\$[A-Za-z]+\d+:\$[A-Za-z]+\d+/g;

  // Function to replace the pattern and collect the cell references
  const result = input.replace(cellRangePattern, (match) => {
    const [start, end] = match.split(":");
    return retrieveCellRangeValues(start, end, data);
  });

  return result;
};
