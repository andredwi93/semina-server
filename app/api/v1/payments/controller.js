const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const Payment = require("./model");
const fs = require("fs");
const config = require("../../../config");

const getAllPayment = async (req, res, next) => {
  try {
    const { status } = req.query;
    let condition = { user: req.user.id };

    if (status) {
      condition = { ...condition, status: status };
    }

    const result = await Payment.find(condition);

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const { type, status } = req.body;
    const user = req.user.id;

    let result;

    if (!req.file) {
      result = new Payment({ type, status, user });
    } else {
      result = new Payment({ type, status, imageUrl: req.file.filename, user });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOnePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    const result = await Payment.findOne({
      _id: id,
      user,
    });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Payment id: " + id);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { type, status } = req.body;
    const user = req.user.id;
    const { id } = req.params;

    let result = await Payment.findOne({
      _id: id,
      user,
    });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Payment id: " + id);
    }

    if (!req.file) {
      result.type = type;
      result.status = status;
    } else {
      let currentImage = `${config.rootPath}/public/uploads/${result.imageUrl}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      result.type = type;
      result.status = status;
      result.imageUrl = req.file.filename;
    }

    await result.save();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id } = req.params;

    const result = await Payment.findOne({ _id: id, user });

    let currentImage = `${config.rootPath}/public/uploads/${result.imageUrl}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    await result.remove();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const changeStatusPayment = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id } = req.params;

    let result = await Payment.findOne({ _id: id, user });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Payment id: " + id);
    }

    result.status = !result.status;
    await result.save();
    
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPayment,
  createPayment,
  getOnePayment,
  updatePayment,
  deletePayment,
  changeStatusPayment
};
