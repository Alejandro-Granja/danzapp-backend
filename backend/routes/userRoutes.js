const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/usersController.js');

const requireRole = require('../middlewares/authMiddleware.js');


router.get('/', requireRole(['admin']), getUsers);
router.get('/:id', requireRole(['admin', 'critic']), getUserById);
router.put('/:id', requireRole(['admin', 'critic']), updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);

module.exports = router;
