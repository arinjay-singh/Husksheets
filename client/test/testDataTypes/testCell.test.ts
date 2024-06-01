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


});