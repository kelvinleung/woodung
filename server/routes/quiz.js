const express = require("express");
const { Quiz } = require("../db");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, content } = req.body;
  console.log(name, content);
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
    res.json({ code: 3000, message: "Error creating quiz", err });
  }
});

router.get("/all", async (req, res) => {
  try {
    const quizs = await Quiz.findAll();
    return res.json({ code: 0, data: quizs });
  } catch (err) {
    res.json({ code: 3000, message: "Error getting all quizs" });
  }
});

module.exports = router;
