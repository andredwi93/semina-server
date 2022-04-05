const { StatusCodes } = require("http-status-codes");
const Event = require("./model");
const Category = require("../categories/model");
const Speaker = require("../speakers/model");
const CustomAPI = require("../../../errors");
const fs = require("fs");
const config = require("../../../config");

const getAllEvent = async (req, res, next) => {
  try {
    const { keyword, category, speaker } = req.query;
    let condition = { user: req.user.id };

    if (keyword) {
      condition = { ...condition, title: { $regex: keyword, $options: "i" } };
    }

    if (category) {
      condition = { ...condition, category };
    }

    if (speaker) {
      condition = { ...condition, speaker };
    }

    const result = await Event.find(condition)
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "speaker",
        select: { _id: 1, foto: "$avatar", avatar: 1, name: 1, role: 1 },
      });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
      status,
      stock,
    } = req.body;
    const user = req.user.id;

    const checkCategory = await Category.findOne({ _id: category });
    const checkSpeaker = await Speaker.findOne({ _id: speaker });

    if (!checkCategory) {
      throw new CustomAPI.NotFoundError("No category with id: " + category);
    }

    if (!checkSpeaker) {
      throw new CustomAPI.NotFoundError("No speaker with id: " + speaker);
    }

    let result;

    if (!req.file) {
      throw new CustomAPI.BadRequestError('Please upload image / cover');
    } else {
      result = new Event({
        stock,
        status,
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
        user,
      });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    const result = await Event.findOne({ _id: id, user })
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "speaker",
        select: "_id name",
      });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event id: " + id);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const {
      title,
      price,
      date,
      about,
      venueName,
      tagline,
      keyPoint,
      category,
      speaker,
      status,
      stock,
    } = req.body;
    const user = req.user.id;
    const { id } = req.params;

    let result = await Event.findOne({ _id: id, user });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event id: " + id);
    }

    if (!req.file) {
      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagline = tagline;
      result.keyPoint = JSON.parse(keyPoint);
      result.category = category;
      result.speaker = speaker;
      result.status = status ? status : true;
      result.stock = stock;
    } else {
      let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;

      if (result.cover !== "default.png" && fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      result.title = title;
      result.price = price;
      result.date = date;
      result.about = about;
      result.venueName = venueName;
      result.tagline = tagline;
      result.keyPoint = JSON.parse(keyPoint);
      result.category = category;
      result.speaker = speaker;
      result.status = status ? status : true;
      result.stock = stock;
      result.cover = req.file.name;
    }

    await result.save();
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    const result = await Event.findOne({ _id: id, user });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Event id: " + id);
    }

    let currentImage = `${config.rootPath}/public/uploads/${result.cover}`;

    if (result.cover !== "default.png" && fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    await result.remove();

    res
      .status(StatusCodes.OK)
      .json({ message: `Event ${result.title} was deleted`, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvent,
  createEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
};
