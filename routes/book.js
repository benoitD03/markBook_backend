const express = require('express');
const bookController = require('../controllers/book');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, bookController.createBook);
router.get('/', auth, bookController.getAllUsersBooks);
router.put('/one/:id', auth, bookController.modifyBook);
router.delete('/one/:id', auth, bookController.deleteBook);

module.exports = router;