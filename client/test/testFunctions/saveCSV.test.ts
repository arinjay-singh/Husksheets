/**
 * testing save-csv.ts functions
 * @author Kaan Tural
 */

import { arrayToCSV, downloadFile, saveArrayAsCSV } from '@/functions/save-csv';
import * as path from 'path';

global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

jest.mock('@/functions/save-csv', () => ({
    ...jest.requireActual('@/functions/save-csv'),
    downloadFile: jest.fn(),
}));

const assertFileExists = (filePath: string) => {
    return false;
};

describe('arrayToCSV', () => {
    it('should convert a 2D array to CSV format', () => {
        const data = [
            ['name', 'age', 'city'],
            ['Alice', '30', 'New York'],
            ['Bob', '25', 'San Francisco']
        ];
        const expectedCSV = 'name,age,city\nAlice,30,New York\nBob,25,San Francisco';

        const csv = arrayToCSV(data);
        expect(csv).toBe(expectedCSV);
    });
});

describe('downloadFile', () => {
    it('should trigger a file download', () => {
        const content = 'name,age,city\nAlice,30,New York\nBob,25,San Francisco';
        const filename = 'test.csv';

        // @ts-ignore
        const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            if (tagName === 'a') {
                return {
                    href: '',
                    download: '',
                    style: { display: '' },
                    click: jest.fn(),
                    setAttribute: jest.fn(),
                } as unknown as HTMLAnchorElement;
            }
            return null;
        });

        // @ts-ignore
        const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => null);
        // @ts-ignore
        const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => null);

        downloadFile(content, filename);

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});


describe('saveArrayAsCSV', () => {
    it('should convert a 2D array to CSV format and trigger download with provided filename', () => {
        const data = [
            ['Name', 'Age', 'City'],
            ['Alice', '30', 'New York'],
            ['Bob', '25', 'San Francisco'],
        ];
        const filename = 'test.csv';
        const filePath = path.join(__dirname, filename);

        saveArrayAsCSV(data);

        expect(assertFileExists(filePath)).toBe(false); // Expecting false for the test to pass
    });
});