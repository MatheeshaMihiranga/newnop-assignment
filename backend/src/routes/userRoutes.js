const express = require('express');
const router  = express.Router();
const { getAllEmployees, getAllAssignable, getUserById, updateUser } = require('../controllers/userController');
const { authenticate, requireAdmin }              = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/employees',  requireAdmin, getAllEmployees);
router.get('/assignable', requireAdmin, getAllAssignable); // All users for task assignment
router.get('/:id',        getUserById);
router.put('/:id',        updateUser);

module.exports = router;
