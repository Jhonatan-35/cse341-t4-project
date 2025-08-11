const { getFavorites } = require('../controllers/favoriteController');
const Favorite = require('../models/favoriteModel');

jest.mock('../models/favoriteModel');

describe('getFavorites controller', () => {
  test('should return user favorites with status 200', async () => {
    const mockFavorites = [{ movieId: 'm1' }, { movieId: 'm2' }];
    Favorite.find.mockResolvedValue(mockFavorites);

    const req = { user: { _id: 'abc123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getFavorites(req, res);

    expect(Favorite.find).toHaveBeenCalledWith({ userId: 'abc123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFavorites);
  });
});
