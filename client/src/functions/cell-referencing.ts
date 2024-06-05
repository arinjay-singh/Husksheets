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
    // extract column from letters
    const letterMatch = cell.match(/[a-zA-Z]+/);
    const letter = letterMatch ? letterMatch[0].toUpperCase() : ''; 

    // extract row from numbers
    const numberMatch = cell.match(/\d+/);
    const row = numberMatch ? parseInt(numberMatch[0]) : 0;

    // convert column letter to index
    const col = letter.split('').reduce((acc, char) => {
        return acc * 26 + char.charCodeAt(0) - 64;
    }, 0);

    // return 0-indexed row and column index
    return [row-1,col-1];
}