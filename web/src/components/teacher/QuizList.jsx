import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";

const QuizList = () => {
  const [quizs, setQuizs] = useState([]);
  const { user } = useAuth();

  async function getQuizs() {
    const response = await axios.get("/api/v1/quiz/all", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (response.data.code === 0) {
      setQuizs(response.data.data);
    }
  }

  useEffect(() => {
    getQuizs();
  }, []);

  return (
    <>
      <Navbar>
        <Link
          to={"/editor"}
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
                <button className="px-4 py-2 rounded-md bg-sky-50 text-sky-500 text-sm">
                  开始游戏
                </button>
                <button className="px-4 py-2 rounded-md bg-slate-50 text-slate-500 text-sm">
                  编辑游戏
                </button>
              </section>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default QuizList;
