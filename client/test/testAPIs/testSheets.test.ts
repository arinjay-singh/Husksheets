import { useCreateSheet, useGetSheets, useDeleteSheet } from '../../src/app/api/api/sheets';
import { useApi } from '../../src/app/api/api/apiService';
import { describe } from 'node:test';

import {  it, expect, beforeEach } from '@jest/globals';
import {useAuth} from "@/context/auth-context";

jest.mock('../../src/app/api/api/apiService');
jest.mock('../../src/context/auth-context');

describe('API Hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('useCreateSheet', () => {
    it('should call the createSheet API and return the expected success property', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: null,
          value: [],
          time: 1718312088693,
        },
      };

      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      (useApi as jest.Mock).mockReturnValue({ post: mockPost });

      const { createSheet } = useCreateSheet();
      const createSheetResponse = await createSheet("Team5", "testSheet");

      expect(mockPost).toHaveBeenCalledWith('/createSheet', { publisher: "Team5", sheet: "testSheet" });
      expect(createSheetResponse.data.success).toEqual(true);
    });
  });

  describe('useGetSheets', () => {
    it('should call the getSheets API and return the expected success property and sheet Team5', async () => {
      const mockResponse = {
        success: true,
        message: null,
        value: [
          {
            publisher: "Team5",
            sheet: "testSheet",
            id: null,
            payload: null,
          },
        ],
        time: 1718314551134,
      };

      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse });
      (useApi as jest.Mock).mockReturnValue({ post: mockPost });

      const { getSheets } = useGetSheets();
      const getSheetsResponse = await getSheets("Team5");

      expect(mockPost).toHaveBeenCalledWith('/getSheets', { publisher: "Team5" });

      expect(mockPost).toHaveBeenCalledWith('/getSheets', { publisher: "Team5" });
      expect(getSheetsResponse).toEqual(["testSheet"])

    });
  });

  describe('useDeleteSheet', () => {
    it('should call the deleteSheet API and return success', async () => {
      // Mock the useAuth hook to return a static publisher name
      const mockAuth = { auth: { username: 'testUser' } };
      (useAuth as jest.Mock).mockReturnValue(mockAuth);

      const mockResponse = {
        data: {
          success: true,
          message: null,
          value: null,
          time: 1718314551134,
        },
      };
      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      (useApi as jest.Mock).mockReturnValue({ post: mockPost });

      const { deleteSheet } = useDeleteSheet();
      const deleteSheetResponse = await deleteSheet('testSheet');

      expect(mockPost).toHaveBeenCalledWith('/deleteSheet', { publisher: 'testUser', sheet: 'testSheet' });

      expect(deleteSheetResponse.data.success).toEqual(true);
    });
  });
});


