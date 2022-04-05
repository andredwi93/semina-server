const router = require('express').Router()
const upload = require('../../../middlewares/multer')
const { authenticateUser } = require('../../../middlewares/auth')
const { getAllEvent, createEvent, getOneEvent, updateEvent, deleteEvent } = require('./controller')

router.get('/', authenticateUser, getAllEvent)
router.post('/', authenticateUser, upload.single('cover'), createEvent)
router.get('/:id', authenticateUser, getOneEvent)
router.put('/:id', authenticateUser, upload.single('cover'), updateEvent)
router.delete('/:id', authenticateUser, deleteEvent)

module.exports = router