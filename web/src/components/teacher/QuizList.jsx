import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import request from "../../common/api";
import { useState } from "react";
import {
  API_GET_QUIZZES_URL,
  CREATE_QUIZ_URL,
  EDIT_QUIZ_URL,
  QUIZ_CONTROLLER_URL,
} from "../../common/constants";

const QuizList = () => {
  const [quizs, setQuizzess] = useState([]);
  const { user } = useAuth();

  async function getQuizzes() {
    const response = await request.get(API_GET_QUIZZES_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setQuizzess(response.data.quizzes);
  }

  useEffect(() => {
    getQuizzes();
  }, []);

  return (
    <>
      <Navbar>
        <Link
          to={CREATE_QUIZ_URL}
          className="px-6 flex items-center cursor-pointer rounded-md text-white text-sm bg-sky-500"
        >
          创建新游戏
        </Link>
      </Navbar>
      <main className="pt-20 min-h-screen bg-slate-50">
        <ul className="py-8 m-auto max-w-[800px]">
          {quizs.map((quiz) => (
            <li
              className="p-8 mb-4 last:mb-0 flex rounded-lg bg-white shadow-sm"
              key={quiz.id}
            >
              <section className="flex flex-col justify-between flex-grow">
                <h2 className="mb-4 text-xl">{quiz.name}</h2>
                <p className="text-neutral-400 font-thin text-sm">{`共 ${quiz.content.length} 题`}</p>
              </section>
              <section className="flex flex-col gap-4 justify-between">
                <Link
                  to={`${QUIZ_CONTROLLER_URL}/${quiz.id}`}
                  className="px-4 py-2 rounded-md bg-sky-50 text-sky-500 text-sm"
                >
                  开始游戏
                </Link>
                <Link
                  to={`${EDIT_QUIZ_URL}/${quiz.id}`}
                  className="px-4 py-2 rounded-md bg-slate-50 text-slate-500 text-sm"
                >
                  编辑游戏
                </Link>
              </section>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default QuizList;
