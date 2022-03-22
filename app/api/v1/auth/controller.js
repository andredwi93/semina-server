const { StatusCodes } = require('http-status-codes');
const CustomAPI = require('../../../errors');
const { createToken, createTokenUser } = require('../../../utils');
const User = require('../users/model');

const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    const result = new User({ email, password, name })
    await result.save()

    delete result._doc.password

    res.status(StatusCodes.CREATED).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new CustomAPI.BadRequestError.BadRequest()
    }

    const result = await User.findOne({ email: email })

    if (!result) {
      throw new CustomAPI.UnauthorizedError('Invalid credential')
    }

    const isPasswordCorrect = await result.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new CustomAPI.UnauthorizedError('Invalid credential')
    }

    const token = createToken({ payload: createTokenUser(result) })

    res.status(StatusCodes.OK).json({ data: { token } })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  signup,
  signin
}