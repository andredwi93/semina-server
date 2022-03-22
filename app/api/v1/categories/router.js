const express = require('express');
const { authenticateUser } = require('../../../middlewares/auth');
const { getAllCategory, createCategory, getOneCategory, updateCategory, deleteCategory } = require('./controller');
const router = express.Router();


router.get('/', authenticateUser, getAllCategory);
router.post('/', authenticateUser, createCategory);
router.get('/:id', authenticateUser, getOneCategory);
router.put('/:id', authenticateUser, updateCategory);
router.delete('/:id', authenticateUser, deleteCategory);

module.exports = router;
