/**
 * @file sheet.ts
 * @brief Spreadsheet class to represent a sheets
 * @version 1.0
 * @date 05-31-2024
 * @author Troy Caron
 */

import { Cell } from './cell';

/**
 * Represents a spreadsheet.
 */
class Spreadsheet {

    public cells: Map<string, Cell>;
    private rows: number;
    private cols: number;

    /**
     * Constructs and initializes a spreadsheet with the specified number of rows and columns.
     * @param rows the number of rows in the spreadsheet
     * @param cols the number of columns in the spreadsheet
     */
    constructor(rows: number, cols: number) {
        this.cells = new Map<string, Cell>();
        this.rows = rows;
        this.cols = cols;
        if (rows <= 0) {
            throw new Error('Rows must be greater than or equal to 1');
        }
        if (cols <= 0) {
            throw new Error('Columns must be greater than or equal to 1');
        }

        this.initializeCells();
    }

    /**
     * Initializes all cells in the spreadsheet so that they are can be referenced from
     * A1, B1, C1 ... A2, B2, C2 etc.
     */
    private initializeCells(): void {
        for (let row = 1; row <= this.rows; row++) {
            for (let col = 1; col <= this.cols; col++) {
                const ref = `$${this.columnToLetter(col)}${row}`;
                this.cells.set(ref, new Cell());
            }
        }
    }

    /**
     * Converts a numerical column value to its corresponding column letter(s)
     * in a spreadsheet format (A, B, AA).
     * @param column the number of the column that the given cell is in
     * @returns a string representing the column number as a letter
     */
    private columnToLetter(column: number): string {
        let letter = '';
        while (column > 0) {
            let temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter;
    }  


    /**
     * Returns the cell at the specified reference.
     * @param ref the reference of the cell to get
     * @returns the cell at the specified reference, or null if no cell exists at that reference
     */
    public getCell(ref: string): Cell | null {
        return this.cells.get(ref) || null;
    }


}

export { Spreadsheet }