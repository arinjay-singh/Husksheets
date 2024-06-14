/**
 * @file testCell.test.ts
 * @brief Tests for the Cell class
 * @version 1.0
 * @date 06-01-2024
 * @author Troy Caron
 */


import { Cell } from '../../src/data-types/cell';



describe("Cell", () => {
    test('should initialize cell with correct default values', () => {
        const cell = new Cell();
        expect(cell.color).toBe("white");
        expect(cell.text).toBe("");
        expect(cell.font).toBe("Arial");
    });

    test('should correctly initialize cell when given values', () => {
        const cell = new Cell("black", "Test Text", "Times New Roman");
        expect(cell.color).toBe("black");
        expect(cell.text).toBe("Test Text");
        expect(cell.font).toBe("Times New Roman");
    });

    test('should correctly update values from defaults', () => {
        const cell = new Cell();
        cell.text = "Test Text";
        cell.color = "black";
        cell.font = "Times New Roman";
        expect(cell.color).toBe("black");
        expect(cell.text).toBe("Test Text");
        expect(cell.font).toBe("Times New Roman");
    });

    test('should correctly reset values after being updated', () => {
        const cell = new Cell();
        cell.text = "Test Text";
        cell.color = "black";
        cell.font = "Times New Roman";
        cell.reset();
        expect(cell.color).toBe("white");
        expect(cell.text).toBe("");
        expect(cell.font).toBe("Arial");
    });

    test('getters and setters', () => {
        const cell = new Cell();
        cell.formula = "=($A1 + 12.0)";
        cell.displayCellInfo();
        expect(cell.formula).toBe("=($A1 + 12.0)");
    });


});