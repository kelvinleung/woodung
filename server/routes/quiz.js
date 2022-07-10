const express = require("express");
const { Quiz } = require("../models");
const Codes = require("../common/codes");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, content } = req.body;
  try {
    const quiz = await Quiz.create({ name, content });
    return res.json({
      ...Codes.Quiz.CREATE_SUCCESS,
      data: { id: quiz.id },
    });
  } catch (err) {
    res.json({ ...Codes.Quiz.CREATE_ERROR });
  }
});

router.delete("/delete", async (req, res) => {
  const { id } = req.query;
  try {
    const count = await Quiz.destroy({ where: { id } });
    if (count === 1) {
      return res.json({
        ...Codes.Quiz.DELETE_SUCCESS,
        data: {
          id,
        },
      });
    } else {
      return res.json({ ...Codes.Quiz.DELETE_NOT_FOUND });
    }
  } catch (err) {
    res.json({ ...Codes.Quiz.DELETE_ERROR });
  }
});

router.post("/update", async (req, res) => {
  const { id } = req.query;
  const { name, content } = req.body;
  try {
    const updateResult = await Quiz.update(
      { name, content },
      { where: { id } }
    );
    if (updateResult[0] === 1) {
      return res.json({
        ...Codes.Quiz.UPDATE_SUCCESS,
        data: { id },
      });
    } else {
      return res.json({ ...Codes.Quiz.UPDATE_NOT_FOUND });
    }
  } catch (err) {
    res.json({ ...Codes.Quiz.UPDATE_ERROR });
  }
});

router.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    const quiz = await Quiz.findOne({ where: { id } });
    if (quiz) {
      return res.json({
        ...Codes.Quiz.GET_BY_ID_SUCCESS,
        data: { quiz },
      });
    } else {
      return res.json({ ...Codes.Quiz.GET_BY_ID_NOT_FOUND });
    }
  } catch (err) {
    res.json({ ...Codes.Quiz.GET_BY_ID_ERROR });
  }
});

router.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    return res.json({ ...Codes.Quiz.GET_ALL_SUCCESS, data: { quizzes } });
  } catch (err) {
    res.json({ ...Codes.Quiz.GET_ALL_ERROR });
  }
});

module.exports = router;
