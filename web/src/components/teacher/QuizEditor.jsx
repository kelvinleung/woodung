import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "./Navbar";
import QuestionContent from "./QuestionContent";
import QuestionList from "./QuestionList";
import axios from "axios";

const CREATE_QUIZ_URL = "/api/v1/quiz/create";

const QuizEditor = () => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([
    {
      description: "",
      options: ["", "", "", ""],
      answerId: -1,
    },
  ]);
  const [activeId, setActiveId] = useState(0);
  const { user } = useAuth();

  const createQuiz = async () => {
    console.log(questions);
    const { id, token } = user;
    const response = await axios.post(
      CREATE_QUIZ_URL,
      { id, name, content: questions },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response.data);
  };

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
    <>
      <Navbar>
        <input
          className="px-4 mr-4 w-[360px] bg-slate-100 rounded-md outline-none"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入游戏名称"
        />
        <button
          className="px-6 flex flex-shrink-0 items-center cursor-pointer rounded-md text-white text-sm bg-sky-500"
          onClick={createQuiz}
        >
          保存游戏
        </button>
      </Navbar>
      <main className="pt-20 flex h-screen min-w-[1080px] bg-slate-50 overflow-hidden">
        <QuestionList
          questions={questions}
          onAddQuestion={addQuestion}
          onSelectQuestion={selectQuestion}
          onRemoveQuestion={removeQuestion}
          activeId={activeId}
        />
        <QuestionContent
          question={currentQuestion}
          onDescriptionChange={updateDescription}
          onOptionsChange={updateOptions}
          onSetAnswer={updateAnswer}
        />
      </main>
    </>
  );
};

export default QuizEditor;
