import { 
  searchPeople, 
  listPeople, 
  getPersonDetails, 
  getPersonNotes, 
  createPersonNote 
} from '../../src/objects/people.js';
import { getAttioClient } from '../../src/api/attio-client.js';

// Mock the attio-client module
jest.mock('../../src/api/attio-client.js');

describe('people', () => {
  // Mock data
  const mockPeopleData = [
    {
      id: { record_id: 'person1' },
      values: { name: [{ value: 'John Doe' }] }
    },
    {
      id: { record_id: 'person2' },
      values: { name: [{ value: 'Jane Smith' }] }
    }
  ];

  const mockPersonDetails = {
    id: { record_id: 'person1' },
    values: {
      name: [{ value: 'John Doe' }],
      email: [{ value: 'john@example.com' }],
      phone: [{ value: '+1234567890' }]
    }
  };

  const mockNotes = [
    { id: { note_id: 'note1' }, title: 'First meeting', content: 'Met with John' },
    { id: { note_id: 'note2' }, title: 'Follow-up', content: 'Discussed next steps' }
  ];

  const mockCreatedNote = {
    id: { note_id: 'note3' },
    title: '[AI] Test Note',
    content: 'This is a test note'
  };

  // Mock API client
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockApi = { get: mockGet, post: mockPost };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAttioClient as jest.Mock).mockReturnValue(mockApi);
  });

  describe('searchPeople', () => {
    it('should search for people by name', async () => {
      mockPost.mockResolvedValueOnce({
        data: { data: mockPeopleData }
      });

      const result = await searchPeople('John');

      expect(mockPost).toHaveBeenCalledWith('/objects/people/records/query', {
        filter: {
          name: { '$contains': 'John' }
        }
      });
      
      expect(result).toEqual(mockPeopleData);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockPost.mockRejectedValueOnce(error);

      await expect(searchPeople('John')).rejects.toThrow('API error');
    });

    it('should return empty array when no data is returned', async () => {
      mockPost.mockResolvedValueOnce({
        data: {}
      });

      const result = await searchPeople('NonExistentPerson');

      expect(result).toEqual([]);
    });
  });

  describe('listPeople', () => {
    it('should list people with default parameters', async () => {
      mockPost.mockResolvedValueOnce({
        data: { data: mockPeopleData }
      });

      const result = await listPeople();

      expect(mockPost).toHaveBeenCalledWith('/objects/people/records/query', {
        limit: 20,
        sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
      });
      
      expect(result).toEqual(mockPeopleData);
    });

    it('should list people with custom limit', async () => {
      mockPost.mockResolvedValueOnce({
        data: { data: mockPeopleData }
      });

      const result = await listPeople(5);

      expect(mockPost).toHaveBeenCalledWith('/objects/people/records/query', {
        limit: 5,
        sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
      });
      
      expect(result).toEqual(mockPeopleData);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockPost.mockRejectedValueOnce(error);

      await expect(listPeople()).rejects.toThrow('API error');
    });
  });

  describe('getPersonDetails', () => {
    it('should get person details by ID', async () => {
      mockGet.mockResolvedValueOnce({
        data: mockPersonDetails
      });

      const result = await getPersonDetails('person1');

      expect(mockGet).toHaveBeenCalledWith('/objects/people/records/person1');
      expect(result).toEqual(mockPersonDetails);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockGet.mockRejectedValueOnce(error);

      await expect(getPersonDetails('person1')).rejects.toThrow('API error');
    });
  });

  describe('getPersonNotes', () => {
    it('should get notes for a person with default parameters', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: mockNotes }
      });

      const result = await getPersonNotes('person1');

      expect(mockGet).toHaveBeenCalledWith(
        '/notes?limit=10&offset=0&parent_object=people&parent_record_id=person1'
      );
      
      expect(result).toEqual(mockNotes);
    });

    it('should get notes with custom limit and offset', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: mockNotes }
      });

      const result = await getPersonNotes('person1', 5, 10);

      expect(mockGet).toHaveBeenCalledWith(
        '/notes?limit=5&offset=10&parent_object=people&parent_record_id=person1'
      );
      
      expect(result).toEqual(mockNotes);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockGet.mockRejectedValueOnce(error);

      await expect(getPersonNotes('person1')).rejects.toThrow('API error');
    });

    it('should return empty array when no data is returned', async () => {
      mockGet.mockResolvedValueOnce({
        data: {}
      });

      const result = await getPersonNotes('person1');

      expect(result).toEqual([]);
    });
  });

  describe('createPersonNote', () => {
    it('should create a note for a person', async () => {
      mockPost.mockResolvedValueOnce({
        data: mockCreatedNote
      });

      const result = await createPersonNote('person1', 'Test Note', 'This is a test note');

      expect(mockPost).toHaveBeenCalledWith('/notes', {
        data: {
          format: 'plaintext',
          parent_object: 'people',
          parent_record_id: 'person1',
          title: '[AI] Test Note',
          content: 'This is a test note'
        }
      });
      
      expect(result).toEqual(mockCreatedNote);
    });

    it('should handle API errors', async () => {
      const error = new Error('API error');
      mockPost.mockRejectedValueOnce(error);

      await expect(createPersonNote('person1', 'Test Note', 'This is a test note'))
        .rejects.toThrow('API error');
    });
  });
});