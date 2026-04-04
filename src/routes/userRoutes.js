const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { idParamValidator, updateUserValidator } = require('../utils/validators');

const router = express.Router();

// All user routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', idParamValidator, validate, getUserById);
router.put('/:id', updateUserValidator, validate, updateUser);
router.delete('/:id', idParamValidator, validate, deleteUser);
router.patch('/:id/role', idParamValidator, validate, updateUserRole);

module.exports = router;