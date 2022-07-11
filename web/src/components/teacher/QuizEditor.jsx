import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import request from "../../common/api";
import Navbar from "./Navbar";
import QuestionContent from "./QuestionContent";
import QuestionList from "./QuestionList";
import { useAuth } from "../../hooks/useAuth";
import {
  API_CREATE_QUIZ_URL,
  API_UPDATE_QUIZ_URL,
  API_GET_QUIZ_URL,
} from "../../common/constants";

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
  const { id: editId } = useParams();

  async function getQuizById() {
    const response = await request.get(API_GET_QUIZ_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
      params: { id: editId },
    });
    const { name, content } = response.data.quiz;
    setName(name);
    setQuestions(content);
  }

  useEffect(() => {
    if (editId) {
      getQuizById();
    }
  }, [editId]);

  const createQuiz = async () => {
    const { id, token } = user;
    const response = await axios.post(
      API_CREATE_QUIZ_URL,
      { id, name, content: questions },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const updateQuiz = async () => {
    const { id, token } = user;
    const response = await axios.post(
      API_UPDATE_QUIZ_URL,
      { id, name, content: questions },
      { headers: { Authorization: `Bearer ${token}` }, params: { id: editId } }
    );
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
          className="px-6 flex flex-shrink-0 items-center rounded-md text-white text-sm bg-sky-500"
          onClick={editId ? updateQuiz : createQuiz}
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
