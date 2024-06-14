/**
 * @file testSaveCSV.test.ts
 * @brief Tests for save-csv
 * @version 1.0
 * @date 06-13-2024
 * @author Troy Caron
 */


import { arrayToCSV, downloadFile, saveArrayAsCSV } from '../../src/functions/save-csv';
import * as fs from 'fs';
import * as path from 'path';
 
function assertFileExists(filePath: string) {
    expect(fs.existsSync(filePath)).toBe(true);
    fs.unlinkSync(filePath); // Clean up the file after the test
}
 
describe('save-csv', () => {
    describe('arrayToCSV', () => {
        it('should convert a 2D array to CSV format', () => {
            const data = [
                ['Name', 'Age', 'City'],
                ['Alice', '30', 'New York'],
                ['Bob', '25', 'San Francisco'],
            ];
            const expectedCSV = 'Name,Age,City\nAlice,30,New York\nBob,25,San Francisco';
            const result = arrayToCSV(data);
            expect(result).toBe(expectedCSV);
        });
    });
 
    describe('downloadFile', () => {
        it('should trigger a download with the correct content and filename', () => {
            const content = 'Name,Age,City\nAlice,30,New York\nBob,25,San Francisco';
            const filename = 'test.csv';
            const filePath = path.join(__dirname, filename);
 
            downloadFile(content, filePath);
 
            assertFileExists(filePath);
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
 
            saveArrayAsCSV(data, filePath);
 
            assertFileExists(filePath);
        });
 
        it('should convert a 2D array to CSV format and trigger download with default filename', () => {
            const data = [
                ['Name', 'Age', 'City'],
                ['Alice', '30', 'New York'],
                ['Bob', '25', 'San Francisco'],
            ];
            const defaultFilename = '../../Husksheet.csv';
            const filePath = path.join(__dirname, defaultFilename);
 
            saveArrayAsCSV(data);
 
            assertFileExists(filePath);
        });
    });
});