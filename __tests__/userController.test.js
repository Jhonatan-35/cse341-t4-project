const { getUserProfile } = require('../controllers/userController');
const User = require('../models/userModel');

jest.mock('../models/userModel');

describe('getUserProfile controller', () => {
  test('should return user profile with status 200', async () => {
    const mockUser = { name: 'Thando', email: 'thando@example.com' };
    User.findById.mockResolvedValue(mockUser);

    const req = { user: { id: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserProfile(req, res);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User profile retrieved successfully',
      user: mockUser
    });
  });

  test('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);

    const req = { user: { id: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User profile not found' });
  });

  test('should handle errors and return status 500', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    const req = { user: { id: 'user123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error getting user profile' })
    );
  });
});
