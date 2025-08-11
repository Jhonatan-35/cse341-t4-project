const { getReviews } = require('../controllers/reviewController');
const Review = require('../models/reviewModel');

jest.mock('../models/reviewModel');

describe('getReviews controller', () => {
  test('should return reviews with status 200', async () => {
    const mockReviews = [{ review: 'Great movie!', rating: 5 }];
    
    // Simulate .find().lean() chain
    Review.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockReviews)
    });

    const req = { params: { id: 'movie123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getReviews(req, res);

    expect(Review.find).toHaveBeenCalledWith({ movieId: 'movie123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReviews);
  });

  test('should return 404 if no reviews found', async () => {
    Review.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([])
    });

    const req = { params: { id: 'movie123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No reviews found for this movie.' });
  });

  test('should return 500 on error', async () => {
    Review.find.mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error('DB error'))
    });

    const req = { params: { id: 'movie123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Error fetching reviews.'
    }));
  });
});
