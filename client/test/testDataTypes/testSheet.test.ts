/**
 * @file testSheet.test.ts
 * @brief Tests for the Spreadsheet class
 * @version 1.0
 * @date 05-31-2024
 * @author Troy Caron
 */


import { Spreadsheet } from '../../src/data-types/sheet';
import { Cell } from '../../src/data-types/cell';


describe("Spreadsheet", () => {
    test('should initialize the correct number of cells', () => {
        const rows = 3;
        const cols = 3;
        const sheet = new Spreadsheet(rows, cols);
        expect(sheet.cells.size).toBe(9);
    });

    test('should correctly convert column number to letter', () => {
        const sheet = new Spreadsheet(2, 2);
        expect(sheet.cells.has('$A1')).toBe(true);
        expect(sheet.cells.has('$B1')).toBe(true);
        expect(sheet.cells.has('$A2')).toBe(true);
        expect(sheet.cells.has('$B2')).toBe(true);
    });

    test('should correctly convert column number to letter when there are more than 26 columns', () => {
        const sheet = new Spreadsheet(1, 27);
        expect(sheet.cells.has('$A1')).toBe(true);
        expect(sheet.cells.has('$B1')).toBe(true);
        expect(sheet.cells.has('$C1')).toBe(true);
        expect(sheet.cells.has('$D1')).toBe(true);
        expect(sheet.cells.has('$E1')).toBe(true);
        expect(sheet.cells.has('$AA1')).toBe(true);

        const lastEntry = Array.from(sheet.cells.entries()).pop();
        expect(lastEntry).not.toBeUndefined();
        if (lastEntry) {
            const [lastKey, lastCell] = lastEntry;
            expect(lastKey).toBe('$AA1');
            expect(lastCell).toBeInstanceOf(Cell);
        }
    });

    test('should verify the default values of first cell in the map', () => {
        const sheet = new Spreadsheet(2, 2);
        const firstEntry = sheet.cells.entries().next().value; // Get the first entry
        const [firstKey, firstCell] = firstEntry;
        expect(firstKey).toBe('$A1');
        expect(firstCell).toBeInstanceOf(Cell);
        expect(firstCell.color).toBe('white');
        expect(firstCell.text).toBe('');
        expect(firstCell.font).toBe('Arial');
        
    });


    test('should update the first cell in the map with text and check the text', () => {
        const sheet = new Spreadsheet(2, 2);
        const firstKey = sheet.cells.keys().next().value; // gets first key
        const firstCell = sheet.getCell(firstKey); // gets first cell using the key
        if (firstCell) {
            firstCell.text = "Test Text"; // updates the cell text
            const updatedCell = sheet.getCell(firstKey);
            expect(updatedCell?.text).toBe("Test Text"); // text should be updated
        } else {
            throw new Error("First cell not found");
        }
    });

    test('cells should be instances of Cell', () => {
        const rows = 2;
        const cols = 2;
        const sheet = new Spreadsheet(rows, cols);
        expect(sheet.cells.get('$A1')).toBeInstanceOf(Cell);
        expect(sheet.cells.get('$B1')).toBeInstanceOf(Cell);
        expect(sheet.getCell('$A6')).toBeNull();
    });

});