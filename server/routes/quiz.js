const express = require("express");
const { Quiz } = require("../db");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, content } = req.body;
  try {
    const quiz = await Quiz.create({ name, content });
    if (quiz) {
      return res.json({
        code: 0,
        message: "Quiz created successfully",
        id: quiz.id,
      });
    } else {
      throw new Error("Error creating quiz");
    }
  } catch (err) {
    res.json({ code: 3000, message: err.message || "Error creating quiz" });
  }
});

router.post("/edit", async (req, res) => {
  const { id } = req.query;
  const { name, content } = req.body;
  try {
    const updateResult = await Quiz.update(
      { name, content },
      { where: { id } }
    );
    console.log(id, updateResult);
    if (updateResult[0] === 1) {
      return res.json({
        code: 0,
        message: "Quiz updated successfully",
        id,
      });
    } else {
      throw new Error("Quiz not found");
    }
  } catch (err) {
    res.json({
      code: 3000,
      message: err.message || "Error updating quiz",
    });
  }
});

router.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    const quiz = await Quiz.findOne({ where: { id } });
    if (quiz) {
      return res.json({
        code: 0,
        data: quiz,
      });
    } else {
      throw new Error("Quiz not found");
    }
  } catch (err) {
    res.json({ code: 3000, message: err.message || "Error getting quiz" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    return res.json({ code: 0, data: quizzes });
  } catch (err) {
    res.json({ code: 3000, message: "Error getting all quizzes" });
  }
});

module.exports = router;
