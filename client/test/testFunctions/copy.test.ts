/**
 * Copy function tests
 * @author Kaan Tural
 */

import parseCopy from '@/functions/copy';
jest.mock('@/functions/cell-referencing', () => ({
    cellMap: jest.fn((cell) => {
        const match = cell.match(/(\w)(\d+)/);
        if (match) {
            const [, col, row] = match;
            return [parseInt(row, 10) - 1, col.charCodeAt(0) - 65]; // Convert to 0-indexed coordinates
        }
        return [0, 0];
    })
}));

describe('parseCopy', () => {
    const data = [
        ['A1', 'B1', 'C1'],
        ['A2', 'B2', 'C2'],
        ['A3', 'B3', 'C3']
    ];

    test('returns null for invalid input', () => {
        const result = parseCopy(data, 'invalid input', [0, 0]);
        expect(result).toBeNull();
    });

    test('parses COPY command correctly and returns result', () => {
        const result = parseCopy(data, '=COPY($A1,"$B2")', [1, 1]);
        expect(result).toEqual(['=$A1', 'A1', [[1, 1], [1, 1]]]);
    });

    test('handles COPY command with same currentCoords', () => {
        const result = parseCopy(data, '=COPY($A1,"$B2")', [0, 0]);
        expect(result).toEqual(['=$A1', 'A1', [[1, 1]]]);
    });

    test('handles COPY command with different currentCoords', () => {
        const result = parseCopy(data, '=COPY($A1,"$B2")', [2, 2]);
        expect(result).toEqual(['=$A1', 'A1', [[1, 1], [2, 2]]]);
    });

    test('trims input before processing', () => {
        const result = parseCopy(data, '=COPY( $A1  ,  "$B2" )', [0, 0]);
        expect(result).toEqual(['=$A1', 'A1', [[1, 1]]]);
    });
});
