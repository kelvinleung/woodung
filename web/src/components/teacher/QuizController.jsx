import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "./Navbar";
import request from "../../common/api";
import { useAuth } from "../../hooks/useAuth";
import { API_GET_QUIZ_URL } from "../../common/constants";

const ROOM_BASE_URL = "http://192.168.0.107:3000/room";

const StudentList = ({ students }) => {
  return (
    <aside className="w-64 p-4 shrink-0 bg-white">
      <ul>
        {students.map((student) => (
          <li
            key={student.id}
            className="p-4 mb-4 last:mb-0 rounded-md bg-slate-50 text-sm truncate"
          >
            {student.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

const QuizController = () => {
  const [socket, setSocket] = useState(null);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(-1);
  // TODO: 计算得分
  const [answers, setAnswers] = useState({});
  const { user } = useAuth();
  const { id: qid } = useParams();

  async function getQuizById() {
    const response = await request.get(API_GET_QUIZ_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
      params: { id: qid },
    });
    const { content } = response.data.quiz;
    setQuestions(content);
  }

  useEffect(() => {
    getQuizById();

    const socketIO = io();

    // 连接状态
    socketIO.on("connect", () => {
      console.log(socketIO.connected);
    });

    // 学生加入房间
    socketIO.on("student-join-room", (student) => {
      setStudents((students) => [...students, student]);
    });

    // 学生离开房间
    socketIO.on("student-leave-room", (id) => {
      setStudents((students) =>
        students.filter((student) => student.id !== id)
      );
    });

    // 学生答题
    socketIO.on("student-answer", ({ qid, aid, uid }) => {
      setAnswers((answers) => {
        if (!answers[uid]) {
          answers[uid] = {};
        }
        answers[uid][qid] = aid;
        return answers;
      });
    });

    socketIO.emit("open-room", qid);

    setSocket(socketIO);
  }, []);

  const step = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) return;
    const nextQuestion = questions[nextIndex];
    socket.emit("question", nextQuestion);
    setIndex(nextIndex);
  };

  return (
    <>
      <Navbar>
        <button className="px-6 flex flex-shrink-0 items-center rounded-md text-white text-sm bg-sky-500">
          下一题
        </button>
      </Navbar>
      <main className="pt-20 h-screen flex bg-slate-50">
        <StudentList students={students} />
        <section className="flex-grow flex flex-col items-center justify-center">
          <div className="flex-grow self-stretch flex justify-center items-center">
            {index === -1 ? (
              <QRCodeCanvas value={`${ROOM_BASE_URL}/${qid}`} size={300} />
            ) : (
              <p>{questions[index].description}</p>
            )}
          </div>
          <button
            className="w-80 py-4 mt-8 mb-16  rounded-md text-white text-lg bg-sky-500"
            onClick={step}
          >
            {index === -1 ? "开始游戏" : "下一题"}
          </button>
        </section>
      </main>
    </>
  );
};

export default QuizController;
