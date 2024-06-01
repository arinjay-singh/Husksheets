/**
 * Represents a cell on a spreadsheet
 */
class Cell {

    private _color: string;
    private _text: string;
    private _font: string;
    private _formula: string | null = null; // Default value is null


    /**
     * Constructs a cell. If no values are provided, color is set to white,
     * text is set to an empty string, and font is set to Arial.
     * @param color the color of the cell
     * @param text the text in the cell
     * @param font the font of the text in the cell
     */
    constructor(color: string = 'white', text: string = '', font: string = 'Arial') {
        this._color = color;
        this._text = text;
        this._font = font;
    }


    // Getters and setters

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get font(): string {
        return this._font;
    }

    set font(value: string) {
        this._font = value;
    }

    get formula(): string | null {
        return this._formula;
    }

    set formula(value: string | null) {
        this._formula = value;

        //this.evaluateFormula(); To be implemented
    }

    // Method to display cell info
    displayCellInfo(): string {
        return `Cell [color=${this._color}, text="${this._text}", font=${this._font}]`;
    }
}

export { Cell }