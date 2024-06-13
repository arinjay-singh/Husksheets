import { base64Convert } from '@/app/api/api/apiService';

describe('base64Convert', () => {
  it('should encode username and password to Base64', async () => {
    const username = 'testuser';
    const password = 'testpassword';
    const expectedEncodedCredentials = btoa(`${username}:${password}`);

    const result = await base64Convert(username, password);

    expect(result).toEqual(expectedEncodedCredentials);
  });
});

