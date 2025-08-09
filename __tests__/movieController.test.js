const { getMovies, getMovieDetails } = require('../controllers/movieController');
const Movie = require('../models/movieModel');

jest.mock('../models/movieModel');

describe('Movies Controller', () => {
  test('getMovies should return movies with status 200', async () => {
    const mockMovies = [
      { title: 'August Rush', genre: 'Drama' },
      { title: 'Interstellar', genre: 'Sci-Fi' }
    ];
    Movie.find.mockResolvedValue(mockMovies);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getMovies(req, res);

    expect(Movie.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Movies retrieved successfully',
      movies: mockMovies
    });
  });

  test('getMovies should return 404 if no movies found', async () => {
    Movie.find.mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getMovies(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No movies found' });
  });

  test('getMovieDetails should return movie with status 200', async () => {
    const mockMovie = { title: 'August Rush', genre: 'Drama' };
    Movie.findById.mockResolvedValue(mockMovie);

    const req = { params: { id: 'movie123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getMovieDetails(req, res);

    expect(Movie.findById).toHaveBeenCalledWith('movie123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Movie details retrieved successfully',
      movie: mockMovie
    });
  });

  test('getMovieDetails should return 404 if movie not found', async () => {
    Movie.findById.mockResolvedValue(null);

    const req = { params: { id: 'movie123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getMovieDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Movie not found' });
  });
});
