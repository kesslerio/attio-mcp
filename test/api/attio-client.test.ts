import axios from 'axios';
import { getAttioClient } from '../../src/api/attio-client.js';

jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue('mocked-axios-instance')
}));

describe('attio-client', () => {
  beforeEach(() => {
    process.env.ATTIO_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ATTIO_API_KEY;
  });

  describe('getAttioClient', () => {
    it('should create an axios instance with correct config', () => {
      const client = getAttioClient();
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.attio.com/v2',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      });
      
      expect(client).toBe('mocked-axios-instance');
    });
  });
});