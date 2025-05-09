import { handleListTools, handleCallTool } from '../../src/handlers/tools.js';
import { 
  searchCompanies, 
  getCompanyDetails, 
  getCompanyNotes, 
  createCompanyNote 
} from '../../src/objects/companies.js';
import { 
  searchPeople, 
  getPersonDetails, 
  getPersonNotes, 
  createPersonNote 
} from '../../src/objects/people.js';
import { createErrorResult } from '../../src/utils/error-handler.js';

// Mock dependent modules
jest.mock('../../src/objects/companies.js');
jest.mock('../../src/objects/people.js');
jest.mock('../../src/utils/error-handler.js');

describe('tools handlers', () => {
  // Mock data
  const mockCompanySearchResults = [
    {
      id: { record_id: 'company1' },
      values: { name: [{ value: 'Acme Corp' }] }
    },
    {
      id: { record_id: 'company2' },
      values: { name: [{ value: 'Globex Inc' }] }
    }
  ];

  const mockPeopleSearchResults = [
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

  const mockCompanyNotes = [
    { id: { note_id: 'note1' }, title: 'Meeting notes', content: 'Discussed project timeline' },
    { id: { note_id: 'note2' }, title: 'Follow-up', content: 'Sent proposal' }
  ];

  const mockPersonNotes = [
    { id: { note_id: 'note3' }, title: 'Introduction', content: 'First contact with John' },
    { id: { note_id: 'note4' }, title: 'Career history', content: 'Discussed background' }
  ];

  const mockCreatedCompanyNote = {
    id: { note_id: 'note5' }
  };

  const mockCreatedPersonNote = {
    id: { note_id: 'note6' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createErrorResult as jest.Mock).mockImplementation((error, url, method, data) => ({
      content: [{ type: 'text', text: `Mock error: ${error.message}` }],
      isError: true,
      error: { code: 500, message: error.message, details: 'Mock error details' }
    }));
  });

  describe('handleListTools', () => {
    it('should return a list of available tools', async () => {
      const result = await handleListTools();

      expect(result).toHaveProperty('tools');
      expect(result.tools).toHaveLength(8); // 4 company tools + 4 people tools
      
      // Check that all tools are included
      const toolNames = result.tools.map((tool: any) => tool.name);
      expect(toolNames).toContain('search-companies');
      expect(toolNames).toContain('read-company-details');
      expect(toolNames).toContain('read-company-notes');
      expect(toolNames).toContain('create-company-note');
      expect(toolNames).toContain('search-people');
      expect(toolNames).toContain('read-person-details');
      expect(toolNames).toContain('read-person-notes');
      expect(toolNames).toContain('create-person-note');
    });
  });

  describe('handleCallTool', () => {
    describe('search-companies tool', () => {
      it('should search companies and return formatted results', async () => {
        (searchCompanies as jest.Mock).mockResolvedValueOnce(mockCompanySearchResults);

        const request = {
          params: {
            name: 'search-companies',
            arguments: { query: 'Acme' }
          }
        };

        const result = await handleCallTool(request);

        expect(searchCompanies).toHaveBeenCalledWith('Acme');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Found 2 companies')
            }
          ],
          isError: false
        });
        expect(result.content[0].text).toContain('Acme Corp: attio://companies/company1');
        expect(result.content[0].text).toContain('Globex Inc: attio://companies/company2');
      });

      it('should handle API errors', async () => {
        const error = new Error('API error');
        (searchCompanies as jest.Mock).mockRejectedValueOnce(error);

        const request = {
          params: {
            name: 'search-companies',
            arguments: { query: 'Acme' }
          }
        };

        const result = await handleCallTool(request);

        expect(createErrorResult).toHaveBeenCalled();
        expect(result).toHaveProperty('isError', true);
      });
    });

    describe('search-people tool', () => {
      it('should search people and return formatted results', async () => {
        (searchPeople as jest.Mock).mockResolvedValueOnce(mockPeopleSearchResults);

        const request = {
          params: {
            name: 'search-people',
            arguments: { query: 'John' }
          }
        };

        const result = await handleCallTool(request);

        expect(searchPeople).toHaveBeenCalledWith('John');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Found 2 people')
            }
          ],
          isError: false
        });
        expect(result.content[0].text).toContain('John Doe: attio://people/person1');
        expect(result.content[0].text).toContain('Jane Smith: attio://people/person2');
      });

      it('should handle API errors', async () => {
        const error = new Error('API error');
        (searchPeople as jest.Mock).mockRejectedValueOnce(error);

        const request = {
          params: {
            name: 'search-people',
            arguments: { query: 'John' }
          }
        };

        const result = await handleCallTool(request);

        expect(createErrorResult).toHaveBeenCalled();
        expect(result).toHaveProperty('isError', true);
      });
    });

    describe('read-company-details tool', () => {
      it('should return company details', async () => {
        (getCompanyDetails as jest.Mock).mockResolvedValueOnce(mockCompanyDetails);

        const request = {
          params: {
            name: 'read-company-details',
            arguments: { uri: 'attio://companies/company1' }
          }
        };

        const result = await handleCallTool(request);

        expect(getCompanyDetails).toHaveBeenCalledWith('company1');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Company details for company1')
            }
          ],
          isError: false
        });
      });
    });

    describe('read-person-details tool', () => {
      it('should return person details', async () => {
        (getPersonDetails as jest.Mock).mockResolvedValueOnce(mockPersonDetails);

        const request = {
          params: {
            name: 'read-person-details',
            arguments: { uri: 'attio://people/person1' }
          }
        };

        const result = await handleCallTool(request);

        expect(getPersonDetails).toHaveBeenCalledWith('person1');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Person details for person1')
            }
          ],
          isError: false
        });
      });
    });

    describe('read-company-notes tool', () => {
      it('should return company notes with default parameters', async () => {
        (getCompanyNotes as jest.Mock).mockResolvedValueOnce(mockCompanyNotes);

        const request = {
          params: {
            name: 'read-company-notes',
            arguments: { uri: 'attio://companies/company1' }
          }
        };

        const result = await handleCallTool(request);

        expect(getCompanyNotes).toHaveBeenCalledWith('company1', 10, 0);
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Found 2 notes for company company1')
            }
          ],
          isError: false
        });
      });

      it('should return company notes with custom parameters', async () => {
        (getCompanyNotes as jest.Mock).mockResolvedValueOnce(mockCompanyNotes);

        const request = {
          params: {
            name: 'read-company-notes',
            arguments: { 
              uri: 'attio://companies/company1',
              limit: 5,
              offset: 10
            }
          }
        };

        const result = await handleCallTool(request);

        expect(getCompanyNotes).toHaveBeenCalledWith('company1', 5, 10);
        expect(result).toHaveProperty('isError', false);
      });
    });

    describe('read-person-notes tool', () => {
      it('should return person notes with default parameters', async () => {
        (getPersonNotes as jest.Mock).mockResolvedValueOnce(mockPersonNotes);

        const request = {
          params: {
            name: 'read-person-notes',
            arguments: { uri: 'attio://people/person1' }
          }
        };

        const result = await handleCallTool(request);

        expect(getPersonNotes).toHaveBeenCalledWith('person1', 10, 0);
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Found 2 notes for person person1')
            }
          ],
          isError: false
        });
      });

      it('should return person notes with custom parameters', async () => {
        (getPersonNotes as jest.Mock).mockResolvedValueOnce(mockPersonNotes);

        const request = {
          params: {
            name: 'read-person-notes',
            arguments: { 
              uri: 'attio://people/person1',
              limit: 5,
              offset: 10
            }
          }
        };

        const result = await handleCallTool(request);

        expect(getPersonNotes).toHaveBeenCalledWith('person1', 5, 10);
        expect(result).toHaveProperty('isError', false);
      });
    });

    describe('create-company-note tool', () => {
      it('should create a company note', async () => {
        (createCompanyNote as jest.Mock).mockResolvedValueOnce(mockCreatedCompanyNote);

        const request = {
          params: {
            name: 'create-company-note',
            arguments: { 
              companyId: 'company1',
              noteTitle: 'Test Note',
              noteText: 'This is a test note'
            }
          }
        };

        const result = await handleCallTool(request);

        expect(createCompanyNote).toHaveBeenCalledWith('company1', 'Test Note', 'This is a test note');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Note added to company company1')
            }
          ],
          isError: false
        });
      });
    });

    describe('create-person-note tool', () => {
      it('should create a person note', async () => {
        (createPersonNote as jest.Mock).mockResolvedValueOnce(mockCreatedPersonNote);

        const request = {
          params: {
            name: 'create-person-note',
            arguments: { 
              personId: 'person1',
              noteTitle: 'Test Note',
              noteText: 'This is a test note'
            }
          }
        };

        const result = await handleCallTool(request);

        expect(createPersonNote).toHaveBeenCalledWith('person1', 'Test Note', 'This is a test note');
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: expect.stringContaining('Note added to person person1')
            }
          ],
          isError: false
        });
      });
    });

    it('should handle unknown tool names', async () => {
      const request = {
        params: {
          name: 'unknown-tool',
          arguments: {}
        }
      };

      const result = await handleCallTool(request);

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Error executing tool')
          }
        ],
        isError: true
      });
    });
  });
});