import { useState } from "react";
import "./QuizEditor.css";

const QuestionList = ({
  questions,
  onAddQuestion,
  onSelectQuestion,
  onSave,
  activeId,
}) => {
  return (
    <aside className="quiz-editor__sidebar">
      <ul className="quiz-editor__sidebar-questions-container">
        {questions.map((question) => (
          <li
            className={activeId === question.id ? "active" : undefined}
            key={question.id}
            onClick={() => {
              onSelectQuestion(question.id);
            }}
          >
            {question.description || "新题目"}
          </li>
        ))}
      </ul>
      <button onClick={onAddQuestion}>添加问题</button>
      <button onClick={onSave}>保存问题</button>
    </aside>
  );
};

const Question = ({
  question,
  onDescriptionChange,
  onOptionsChange,
  onSetAnswer,
}) => {
  const options = [...question.options];
  const changeOptions = (val, id) => {
    options[id] = { id, content: val };
    onOptionsChange(options);
  };
  const setAnswer = (id) => {
    onSetAnswer(id);
  };
  return (
    <main className="quiz-editor__main">
      <input
        className="quiz-edtior__desription-input"
        type="text"
        placeholder="请输入问题"
        value={question.description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <ul className="quiz-editor__options-container">
        {options.map((option) => (
          <li className="quiz-editor__option-wrapper" key={option.id}>
            <input
              type="text"
              placeholder="请输入答案"
              value={option.content}
              onChange={(e) => changeOptions(e.target.value, option.id)}
            />
            <button
              className={question.answerId === option.id ? "active" : undefined}
              onClick={() => setAnswer(option.id)}
            ></button>
          </li>
        ))}
      </ul>
    </main>
  );
};

const QuizEditor = () => {
  const [questions, setQuestions] = useState([
    {
      id: 0,
      description: "",
      options: [
        { id: 0, content: "" },
        { id: 1, content: "" },
        { id: 2, content: "" },
        { id: 3, content: "" },
      ],
      answerId: -1,
    },
  ]);
  const [activeId, setActiveId] = useState(0);
  // 修改题目描述
  const updateDescription = (val) => {
    const newQuestions = [...questions];
    newQuestions[activeId].description = val;
    setQuestions(newQuestions);
  };
  // 修改选项
  const updateOptions = (options) => {
    const newQuestions = [...questions];
    newQuestions[activeId].options = options;
    setQuestions(newQuestions);
  };
  // 设置答案
  const updateAnswer = (id) => {
    const newQuestions = [...questions];
    newQuestions[activeId].answerId = id;
    setQuestions(newQuestions);
  };
  // 添加问题
  const addQuestion = () => {
    const newQuestion = {
      id: questions.length,
      description: "",
      options: [
        { id: 0, content: "" },
        { id: 1, content: "" },
        { id: 2, content: "" },
        { id: 3, content: "" },
      ],
      answerId: -1,
    };
    setQuestions([...questions, newQuestion]);
  };
  // 选择题目
  const selectQuestion = (id) => {
    setActiveId(id);
  };
  const currentQuestion = questions[activeId];
  return (
    <div className="quiz-editor__container">
      <QuestionList
        questions={questions}
        onAddQuestion={addQuestion}
        onSelectQuestion={selectQuestion}
        onSave={() => console.log(questions)}
        activeId={activeId}
      />
      <Question
        question={currentQuestion}
        onDescriptionChange={updateDescription}
        onOptionsChange={updateOptions}
        onSetAnswer={updateAnswer}
      />
    </div>
  );
};

export default QuizEditor;
