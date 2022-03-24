const { StatusCodes } = require('http-status-codes')
const Event = require('./model')
const Category = require('../categories/model')
const Speaker = require('../speakers/model')
const CustomAPI = require('../../../errors')

const getAllEvent = async (req, res, next) => {
  try {
    const { keyword, category, speaker } = req.query
    let condition = { user: req.user.id }

    if (keyword) {
      condition = { ...condition, title: { $regex: keyword, $options: 'i' } }
    }

    if (category) {
      condition = { ...condition, category }
    }

    if (speaker) {
      condition = { ...condition, speaker }
    }

    const result = await Event.find(condition)
      .populate({
        path: 'category',
        select: '_id name'
      })
      .populate({
        path: 'speaker',
        select: '_id name'
      })

    res.status(StatusCodes.OK).json({ data: result })

  } catch (err) {
    next(err)
  }
}

const createEvent = async (req, res, next) => {
  try {
    const { title, price, date, about, venueName, tagline, keyPoint, category, speaker } = req.body
    const user = req.user.id

    const checkCategory = await Category.findOne({ _id: category })
    const checkSpeaker = await Speaker.findOne({ _id: speaker })

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError('No category with id: ' + category)
    }

    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError('No speaker with id: ' + speaker)
    }

    let result

    if (!req.file) {
      result = new Event({ title, price, date, about, venueName, tagline, keyPoint, category, speaker, user })
    } else {
      result = new Event(
        {
          title,
          price,
          date,
          about,
          venueName,
          tagline,
          keyPoint: JSON.parse(keyPoint),
          category,
          speaker,
          cover: req.file.filename,
          user
        }
      )
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result })

  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllEvent,
  createEvent
}