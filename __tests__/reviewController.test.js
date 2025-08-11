const { getReviews, submitReview, editReview, deleteReview } = require('../controllers/reviewController');
const Review = require('../models/reviewModel');

jest.mock('../models/reviewModel');

describe('Review Controller', () => {
  const mockUser = { _id: 'user123' };
  const mockMovieId = 'movie456';
  const mockReviewId = 'review789';

  const mockReq = (params = {}, body = {}, user = mockUser) => ({
    params,
    body,
    user
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    res.send = jest.fn();
    return res;
  };

  test('getReviews should return reviews with status 200', async () => {
    const reviews = [{ review: 'Great!', rating: 5 }];
    Review.find.mockResolvedValue(reviews);

    const req = mockReq({ id: mockMovieId });
    const res = mockRes();

    await getReviews(req, res);

    expect(Review.find).toHaveBeenCalledWith({ movieId: mockMovieId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(reviews);
  });

  test('submitReview should create and return review with status 201', async () => {
    const savedReview = { review: 'Amazing!', rating: 5 };
    Review.prototype.save = jest.fn().mockResolvedValue(savedReview);

    const req = mockReq({ id: mockMovieId }, { review: 'Amazing!', rating: 5 });
    const res = mockRes();

    await submitReview(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedReview);
  });

  test('editReview should update and return review with status 200', async () => {
    const updatedReview = { review: 'Updated!', rating: 4 };
    Review.findOneAndUpdate.mockResolvedValue(updatedReview);

    const req = mockReq({ reviewId: mockReviewId }, { review: 'Updated!', rating: 4 });
    const res = mockRes();

    await editReview(req, res);

    expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockReviewId, userId: mockUser._id },
      { review: 'Updated!', rating: 4 },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedReview);
  });

  test('deleteReview should remove review and return status 200', async () => {
    const deletedReview = { _id: mockReviewId };
    Review.findOneAndDelete.mockResolvedValue(deletedReview);

    const req = mockReq({ reviewId: mockReviewId });
    const res = mockRes();

    await deleteReview(req, res);

    expect(Review.findOneAndDelete).toHaveBeenCalledWith({
      _id: mockReviewId,
      userId: mockUser._id
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review deleted successfully.' });
  });
});
