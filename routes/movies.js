const router = require('express').Router();

const { validateMovieSchema, validateMovieId } = require('../middlewares/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieSchema, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
