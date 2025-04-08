const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {isAuthenticatedUser} = require ('../middleware/authMiddleware');
const { registerUser, loginUser, getUserProfile,  updateUser, forgotPass, resetPassword } = require('../controllers/authentication');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login',loginUser);
router.post('/password/forgot',forgotPass);
router.put('/password/reset/:token',resetPassword)
router.get('/profile', getUserProfile);
router.put('/profile/update', upload.single('avatar'), updateUser);

module.exports  =  router;