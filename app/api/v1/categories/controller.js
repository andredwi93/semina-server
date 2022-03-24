const { StatusCodes } = require('http-status-codes')
const Category = require('./model')
const CustomError = require('../../../errors')

const getAllCategory = async (req, res, next) => {
  try {
    const result = await Category.find({ user: req.user.id })

    res.status(StatusCodes.OK).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const user = req.user.id

    const result = await Category.create({ name, user })

    res.status(StatusCodes.CREATED).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const getOneCategory = async (req, res, next) => {
  try {
    console.log(req.params)
    const { id } = req.params
    const user = req.user.id

    const result = await Category.findOne({
      _id: id,
      user
    })

    if (!result) {
      throw new CustomError.NotFoundError('No Category id: ' + id)
    }

    res.status(StatusCodes.OK).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const user = req.user.id

    const check = await Category.findOne({
      name,
      _id: { $ne: id }
    })

    if (check) {
      throw new CustomError.BadRequestError('Duplicate name category')
    }

    const result = await Category.findOneAndUpdate(
      {
        _id: id
      },
      { name, user },
      { new: true, runValidators: true }
    )

    if (!result) {
      throw new CustomError.NotFoundError('No Category id: ' + id)
    }

    res.status(StatusCodes.OK).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await Category.findOne({ _id: id })

    if (!result) {
      throw new CustomError.NotFoundError('No Category id: ' + id)
    }

    await result.remove()
    res.status(StatusCodes.OK).json({ data: result })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllCategory,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory
}