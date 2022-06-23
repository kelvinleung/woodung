import { useState } from "react";
import "./QuizEditor.css";

const QUESTION_COLORS = ["red", "yellow", "blue", "green"];

const QuestionList = ({
  questions,
  onAddQuestion,
  onSelectQuestion,
  onRemoveQuestion,
  activeId,
}) => {
  // 给数据添加 id 字段
  const questionData = questions.map((q, id) => ({ ...q, id }));
  return (
    <aside className="quiz-editor__sidebar">
      <div className="quiz-editor__sidebar-questions-count">{`共 ${questionData.length} 道题目`}</div>
      <ul className="quiz-editor__sidebar-questions-container">
        {questionData.map((question) => (
          <li
            className={activeId === question.id ? "active" : undefined}
            key={question.id}
          >
            <div
              className="quiz-editor__sidebar-question-card"
              onClick={() => {
                onSelectQuestion(question.id);
              }}
            >
              {question.description || "新题目"}
            </div>
            <button
              disabled={questions.length <= 1}
              onClick={() => onRemoveQuestion(question.id)}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      <div className="quiz-editor__sidebar-question-button-container">
        <button className="primary block" onClick={onAddQuestion}>
          添加问题
        </button>
      </div>
    </aside>
  );
};

const Question = ({
  question,
  onDescriptionChange,
  onOptionsChange,
  onSetAnswer,
}) => {
  // 给数据添加 id 字段
  const options = [...question.options].map((content, id) => ({ id, content }));
  const changeOptions = (val, id) => {
    onOptionsChange(val, id);
    // 清除正确答案
    if (!val && question.answerId === id) {
      onSetAnswer(-1);
    }
  };
  const setAnswer = (id) => {
    onSetAnswer(id);
  };
  return (
    <section className="quiz-editor__main">
      <div className="quiz-edtior__desription-container">
        <input
          className="quiz-edtior__desription-input"
          type="text"
          placeholder="请输入问题"
          value={question.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <ul className="quiz-editor__options-container">
        {options.map((option) => (
          <li
            className={`quiz-editor__option-wrapper${
              " " + QUESTION_COLORS[option.id]
            }${option.content ? " filled" : ""}`}
            key={option.id}
          >
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
    </section>
  );
};

const QuizEditor = () => {
  const [questions, setQuestions] = useState([
    {
      description: "",
      options: ["", "", "", ""],
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
  const updateOptions = (val, id) => {
    const newQuestions = [...questions];
    newQuestions[activeId].options[id] = val;
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
      description: "",
      options: ["", "", "", ""],
      answerId: -1,
    };
    // 切换到新增的问题
    setActiveId(questions.length);
    setQuestions([...questions, newQuestion]);
  };
  // 移除问题
  const removeQuestion = (id) => {
    const newQuestions = [...questions];
    if (id === activeId) {
      setActiveId(id - 1);
    }
    newQuestions.splice(id, 1);
    setQuestions(newQuestions);
  };
  // 选择问题
  const selectQuestion = (id) => {
    setActiveId(id);
  };
  const currentQuestion = questions[activeId];
  return (
    <div className="quiz-editor__container">
      <header className="quiz-editor__header">
        <input
          className="quiz-editor__header-input"
          type="text"
          placeholder="请输入游戏名称"
        />
        <button className="primary" onClick={() => console.log(questions)}>
          保存游戏
        </button>
      </header>
      <main className="quiz-editor__content-container">
        <QuestionList
          questions={questions}
          onAddQuestion={addQuestion}
          onSelectQuestion={selectQuestion}
          onRemoveQuestion={removeQuestion}
          activeId={activeId}
        />
        <Question
          question={currentQuestion}
          onDescriptionChange={updateDescription}
          onOptionsChange={updateOptions}
          onSetAnswer={updateAnswer}
        />
      </main>
    </div>
  );
};

export default QuizEditor;
