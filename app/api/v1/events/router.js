const router = require('express').Router()
const upload = require('../../../middlewares/multer')
const { authenticateUser } = require('../../../middlewares/auth')
const { getAllEvent, createEvent } = require('./controller')

router.get('/', authenticateUser, getAllEvent)
router.post('/', authenticateUser, upload.single('cover'), createEvent)
// router.get('/:id', authenticateUser, getOneSpeaker)
// router.put('/:id', authenticateUser, upload.single('avatar'), updateSpeaker)
// router.delete('/:id', authenticateUser, deleteSpeaker)

module.exports = router