import { handleListResources, handleReadResource } from '../../src/handlers/resources.js';
import { listCompanies, getCompanyDetails } from '../../src/objects/companies.js';
import { listPeople, getPersonDetails } from '../../src/objects/people.js';
import { createErrorResult } from '../../src/utils/error-handler.js';

// Mock dependent modules
jest.mock('../../src/objects/companies.js');
jest.mock('../../src/objects/people.js');
jest.mock('../../src/utils/error-handler.js');

describe('resources handlers', () => {
  // Mock data
  const mockCompanies = [
    {
      id: { record_id: 'company1' },
      values: { name: [{ value: 'Acme Corp' }] }
    },
    {
      id: { record_id: 'company2' },
      values: { name: [{ value: 'Globex Inc' }] }
    }
  ];

  const mockPeople = [
    {
      id: { record_id: 'person1' },
      values: { name: [{ value: 'John Doe' }] }
    },
    {
      id: { record_id: 'person2' },
      values: { name: [{ value: 'Jane Smith' }] }
    }
  ];

  const mockCompanyDetails = {
    id: { record_id: 'company1' },
    values: {
      name: [{ value: 'Acme Corp' }],
      industry: [{ value: 'Technology' }]
    }
  };

  const mockPersonDetails = {
    id: { record_id: 'person1' },
    values: {
      name: [{ value: 'John Doe' }],
      email: [{ value: 'john@example.com' }]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createErrorResult as jest.Mock).mockImplementation((error, url, method, data) => ({
      content: [{ type: 'text', text: `Mock error: ${error.message}` }],
      isError: true,
      error: { code: 500, message: error.message, details: 'Mock error details' }
    }));
  });

  describe('handleListResources', () => {
    it('should list companies when no type is specified', async () => {
      (listCompanies as jest.Mock).mockResolvedValueOnce(mockCompanies);

      const request = {
        params: {}
      };

      const result = await handleListResources(request);

      expect(listCompanies).toHaveBeenCalled();
      expect(listPeople).not.toHaveBeenCalled();
      expect(result).toEqual({
        resources: [
          {
            uri: 'attio://companies/company1',
            name: 'Acme Corp',
            mimeType: 'application/json'
          },
          {
            uri: 'attio://companies/company2',
            name: 'Globex Inc',
            mimeType: 'application/json'
          }
        ],
        description: 'Found 2 companies that you have interacted with most recently'
      });
    });

    it('should list people when type is "people"', async () => {
      (listPeople as jest.Mock).mockResolvedValueOnce(mockPeople);

      const request = {
        params: { type: 'people' }
      };

      const result = await handleListResources(request);

      expect(listPeople).toHaveBeenCalled();
      expect(listCompanies).not.toHaveBeenCalled();
      expect(result).toEqual({
        resources: [
          {
            uri: 'attio://people/person1',
            name: 'John Doe',
            mimeType: 'application/json'
          },
          {
            uri: 'attio://people/person2',
            name: 'Jane Smith',
            mimeType: 'application/json'
          }
        ],
        description: 'Found 2 people that you have interacted with most recently'
      });
    });

    it('should handle errors when listing companies', async () => {
      const error = new Error('API error');
      (listCompanies as jest.Mock).mockRejectedValueOnce(error);

      const request = {
        params: {}
      };

      const result = await handleListResources(request);

      expect(createErrorResult).toHaveBeenCalledWith(
        error,
        '/objects/companies/records/query',
        'POST',
        {}
      );
      expect(result).toHaveProperty('isError', true);
    });

    it('should handle errors when listing people', async () => {
      const error = new Error('API error');
      (listPeople as jest.Mock).mockRejectedValueOnce(error);

      const request = {
        params: { type: 'people' }
      };

      const result = await handleListResources(request);

      expect(createErrorResult).toHaveBeenCalledWith(
        error,
        '/objects/people/records/query',
        'POST',
        {}
      );
      expect(result).toHaveProperty('isError', true);
    });
  });

  describe('handleReadResource', () => {
    it('should read company details for company URIs', async () => {
      (getCompanyDetails as jest.Mock).mockResolvedValueOnce(mockCompanyDetails);

      const request = {
        params: {
          uri: 'attio://companies/company1'
        }
      };

      const result = await handleReadResource(request);

      expect(getCompanyDetails).toHaveBeenCalledWith('company1');
      expect(getPersonDetails).not.toHaveBeenCalled();
      expect(result).toEqual({
        contents: [
          {
            uri: 'attio://companies/company1',
            text: JSON.stringify(mockCompanyDetails, null, 2),
            mimeType: 'application/json'
          }
        ]
      });
    });

    it('should read person details for people URIs', async () => {
      (getPersonDetails as jest.Mock).mockResolvedValueOnce(mockPersonDetails);

      const request = {
        params: {
          uri: 'attio://people/person1'
        }
      };

      const result = await handleReadResource(request);

      expect(getPersonDetails).toHaveBeenCalledWith('person1');
      expect(getCompanyDetails).not.toHaveBeenCalled();
      expect(result).toEqual({
        contents: [
          {
            uri: 'attio://people/person1',
            text: JSON.stringify(mockPersonDetails, null, 2),
            mimeType: 'application/json'
          }
        ]
      });
    });

    it('should handle errors when reading company details', async () => {
      const error = new Error('API error');
      (getCompanyDetails as jest.Mock).mockRejectedValueOnce(error);

      const request = {
        params: {
          uri: 'attio://companies/company1'
        }
      };

      const result = await handleReadResource(request);

      expect(createErrorResult).toHaveBeenCalledWith(
        error,
        '/objects/companies/company1',
        'GET',
        {}
      );
      expect(result).toHaveProperty('isError', true);
    });

    it('should handle errors when reading person details', async () => {
      const error = new Error('API error');
      (getPersonDetails as jest.Mock).mockRejectedValueOnce(error);

      const request = {
        params: {
          uri: 'attio://people/person1'
        }
      };

      const result = await handleReadResource(request);

      expect(createErrorResult).toHaveBeenCalledWith(
        error,
        '/objects/people/person1',
        'GET',
        {}
      );
      expect(result).toHaveProperty('isError', true);
    });

    it('should throw an error for unsupported resource URIs', async () => {
      const request = {
        params: {
          uri: 'attio://unsupported/id123'
        }
      };

      const result = await handleReadResource(request);

      expect(createErrorResult).toHaveBeenCalled();
      expect(result).toHaveProperty('isError', true);
    });
  });
});