const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('../middleware/multer-user-config');
const auth = require('../middleware/auth');


router.post('/signup', multer, userController.signup);
router.post('/login', userController.login);
router.get('/me', auth, userController.getMyProfile);
router.get('/one/:id', auth, userController.getOneUser);
router.get('/all', auth, userController.getAllUsers);
router.put('/me', auth, multer, userController.modifyUser);
router.delete('/me', auth, multer, userController.deleteUser);

module.exports = router;