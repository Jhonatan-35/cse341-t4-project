const { getFavorites } = require('../controllers/favoriteController');
const Favorite = require('../models/favoriteModel');

jest.mock('../models/favoriteModel');

describe('getFavorites controller', () => {
  test('should return user favorites with status 200', async () => {
    const mockFavorites = [
      { title: 'Interstellar', userId: 'abc123' },
      { title: 'August Rush', userId: 'abc123' }
    ];

    Favorite.find.mockResolvedValue(mockFavorites);

    const req = { params: { id: 'abc123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getFavorites(req, res);

    expect(Favorite.find).toHaveBeenCalledWith({ userId: 'abc123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFavorites);
  });

  test('should handle errors and return status 500', async () => {
    Favorite.find.mockRejectedValue(new Error('DB error'));

    const req = { params: { id: 'abc123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error retrieving favorites' })
    );
  });
});
