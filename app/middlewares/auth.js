const customError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  try {
    let token

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      throw new customError.UnauthorizedError('Authentication invalid')
    }

    const payload = isTokenValid({ token })

    req.user = {
      email: payload.email,
      id: payload.userId,
      role: payload.role,
      name: payload.name
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { authenticateUser }