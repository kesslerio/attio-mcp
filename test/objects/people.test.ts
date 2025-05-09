import { searchPeople, listPeople, getPersonDetails, getPersonNotes, createPersonNote } from '../../src/objects/people.js';
import * as attioClient from '../../src/api/attio-client.js';

// Mock the API client
jest.mock('../../src/api/attio-client.js');
const mockedAttioClient = attioClient as jest.Mocked<typeof attioClient>;

describe('people', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    
    // Setup mock API client
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockedAttioClient.getAttioClient.mockReturnValue(mockAxiosInstance);
  });

  describe('searchPeople', () => {
    it('should search people by name', async () => {
      // Arrange
      const query = 'Test Person';
      const mockResponse = {
        data: {
          data: [
            { 
              id: { record_id: 'person1' },
              values: { name: [{ value: 'Test Person Inc.' }] }
            }
          ]
        }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Act
      const result = await searchPeople(query);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/objects/people/records/query',
        expect.objectContaining({
          filter: {
            name: { "$contains": query }
          }
        })
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      const query = 'Test Person';
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(searchPeople(query)).rejects.toThrow('API Error');
    });
  });

  describe('listPeople', () => {
    it('should list people sorted by most recent interaction', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: [
            { 
              id: { record_id: 'person1' },
              values: { name: [{ value: 'Person A' }] }
            },
            { 
              id: { record_id: 'person2' },
              values: { name: [{ value: 'Person B' }] }
            }
          ]
        }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Act
      const result = await listPeople();

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/objects/people/records/query',
        expect.objectContaining({
          limit: 20,
          sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
        })
      );
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('getPersonDetails', () => {
    it('should fetch person details by ID', async () => {
      // Arrange
      const personId = 'person123';
      const mockResponse = {
        data: {
          id: { record_id: personId },
          values: { name: [{ value: 'Test Person' }] }
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Act
      const result = await getPersonDetails(personId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/objects/people/records/${personId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPersonNotes', () => {
    it('should fetch notes for a person', async () => {
      // Arrange
      const personId = 'person123';
      const limit = 5;
      const offset = 10;
      const mockResponse = {
        data: {
          data: [
            { id: 'note1', title: 'Note 1', content: 'Content 1' },
            { id: 'note2', title: 'Note 2', content: 'Content 2' }
          ]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Act
      const result = await getPersonNotes(personId, limit, offset);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/notes?limit=${limit}&offset=${offset}&parent_object=people&parent_record_id=${personId}`
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should use default values for limit and offset when not provided', async () => {
      // Arrange
      const personId = 'person123';
      const mockResponse = {
        data: {
          data: [{ id: 'note1' }]
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Act
      await getPersonNotes(personId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/notes?limit=10&offset=0&parent_object=people&parent_record_id=${personId}`
      );
    });
  });

  describe('createPersonNote', () => {
    it('should create a note for a person', async () => {
      // Arrange
      const personId = 'person123';
      const title = 'Test Note';
      const content = 'This is a test note';
      const mockResponse = {
        data: {
          id: { note_id: 'note123' },
          title: '[AI] Test Note',
          content: 'This is a test note'
        }
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Act
      const result = await createPersonNote(personId, title, content);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'notes',
        {
          data: {
            format: 'plaintext',
            parent_object: 'people',
            parent_record_id: personId,
            title: `[AI] ${title}`,
            content: content
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});