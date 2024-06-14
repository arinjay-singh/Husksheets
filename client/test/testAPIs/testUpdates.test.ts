import { useUpdate, useGetUpdatesForSubscription, useGetUpdatesForPublished } from '../../src/app/api/api/update';
import { useApi } from '../../src/app/api/api/apiService';
import { describe } from 'node:test';
import {  it, expect, beforeEach } from '@jest/globals';
jest.mock('../../src/app/api/api/apiService');

/**
 * @file testUpdates.test.ts
 * @brief test get updates/ update apis.
 * @author Nicholas O'Sullivan
 */

describe('useUpdate', () => {
  it('should call updatePublished API when isOwner is true', async () => {
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

    const { updatePublished } = useUpdate();
    const result = await updatePublished('TestPublisher', 'TestSheet', 'PayloadData', true);

    expect(mockPost).toHaveBeenCalledWith('/updatePublished', {
      publisher: 'TestPublisher',
      sheet: 'TestSheet',
      payload: 'PayloadData',
    });
    expect(result.data.success).toEqual(true);
  });

  it('should call updateSubscription API when isOwner is false', async () => {
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

    const { updatePublished } = useUpdate();
    const result = await updatePublished('TestPublisher', 'TestSheet', 'PayloadData', false);

    expect(mockPost).toHaveBeenCalledWith('/updateSubscription', {
      publisher: 'TestPublisher',
      sheet: 'TestSheet',
      payload: 'PayloadData',
    });
    expect(result.data.success).toEqual(true);
  });
});

describe('useGetUpdatesForSubscription', () => {
  it('should call getUpdatesForSubscription API', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: null,
        value: [{ payload: 'a1' }, { payload: 'b1' }],
        time: 1718314551134,
      },
    };
    const mockPost = jest.fn().mockResolvedValue(mockResponse);
    (useApi as jest.Mock).mockReturnValue({ post: mockPost });

    const { getUpdatesForSubscription } = useGetUpdatesForSubscription();
    const result = await getUpdatesForSubscription('TestPublisher', 'TestSheet', 1);

    expect(mockPost).toHaveBeenCalledWith('/getUpdatesForSubscription', {
      publisher: 'TestPublisher',
      sheet: 'TestSheet',
      id: 1,
    });
    expect(result).toEqual(['a1', 'b1']);
  });
});

describe('useGetUpdatesForPublished', () => {
  it('should call getUpdatesForPublished API', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: null,
        value: [{ payload: 'a1' }, { payload: 'b1' }],
        time: 1718314551134,
      },
    };
    const mockPost = jest.fn().mockResolvedValue(mockResponse);
    (useApi as jest.Mock).mockReturnValue({ post: mockPost });

    const { getUpdatesForPublished } = useGetUpdatesForPublished();
    const result = await getUpdatesForPublished('TestPublisher', 'TestSheet', 1);

    expect(mockPost).toHaveBeenCalledWith('/getUpdatesForPublished', {
      publisher: 'TestPublisher',
      sheet: 'TestSheet',
      id: 1,
    });
    expect(result).toEqual(['a1', 'b1']);
  });
});
