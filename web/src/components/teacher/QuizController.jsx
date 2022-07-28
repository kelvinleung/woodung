import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "./Navbar";
import request from "../../common/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { API_GET_QUIZ_URL } from "../../common/constants";

const ROOM_BASE_URL = "http://192.168.0.107:3000/room";

const StudentList = ({ students }) => {
  return (
    <aside className="w-64 p-4 shrink-0 overflow-auto bg-white shadow-sm">
      <ul>
        {students.map((student) => (
          <li
            key={student.id}
            className="p-4 mb-4 last:mb-0 rounded-md bg-slate-50 text-sm truncate"
          >
            <span
              className={[
                "w-2 h-2 mr-2 inline-block rounded-full",
                student.connected ? "bg-green-600" : "bg-gray-400",
              ].join(" ")}
            ></span>
            {student.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

const QuestionState = ({ question }) => {
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <p className="mb-8 flex-grow flex justify-center items-center bg-white rounded-lg text-center text-3xl">
        {question.description}
      </p>
      <ul className="flex-grow grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <li
            key={option.id}
            className="p-8 flex justify-center items-center text-white text-2xl text-center rounded-lg"
            style={{ backgroundColor: option.color }}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ScoresState = ({ data }) => {
  const { scores, count } = data;
  return (
    <ul className="max-w-[600px] w-full p-8">
      {scores.map((student, index) => {
        return (
          <li
            key={student.id}
            className="p-8 mb-4 last:mb-0 flex items-center bg-white rounded-lg shadow-sm"
          >
            <span className="w-12 h-12 flex justify-center items-center rounded-full bg-amber-200 text-amber-600 text-xl font-bold">
              {index + 1}
            </span>
            <span className="mx-8 flex-grow truncate">{student.name}</span>
            <span>
              {student.score}/{count}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const QuizController = () => {
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(-1);
  const [roomId, setRoomId] = useState();
  const [scores, setScores] = useState(null);
  const [currentState, setCurrentState] = useState("waiting");
  // Refs
  const socketRef = useRef(null);
  const answersRef = useRef({});

  const { user } = useAuth();
  const { toast } = useToast();
  const { id: qid } = useParams();

  const currentQuestion = questions[index];

  const getQuizById = async () => {
    const response = await request.get(API_GET_QUIZ_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
      params: { id: qid },
    });
    const newQuestions = response.data.quiz.content.map((question, i) => {
      question.id = i;
      return question;
    });
    setQuestions(newQuestions);
  };

  const calculateScores = () => {
    return students
      .map((student) => {
        const { id, name } = student;
        let score = 0;
        const studentAnswers = answersRef.current[student.id];
        if (!studentAnswers) {
          return { id, name, score: 0 };
        }
        questions.forEach((question) => {
          const studentAnswerId = studentAnswers[question.id];
          if (
            studentAnswerId !== undefined &&
            studentAnswerId === question.answerId
          ) {
            score += 1;
          }
        });
        return { id, name, score };
      })
      .sort((a, b) => b.score - a.score);
  };

  useEffect(() => {
    getQuizById();

    socketRef.current = io({ autoConnect: false });

    socketRef.current.auth = { userId: user.id, role: "teacher" };

    // 连接状态
    socketRef.current.on("connect", () => {
      toast.success("连接成功");
    });

    socketRef.current.on("room_info", (roomId) => {
      setRoomId(roomId);
      // DEBUG: 方便连接测试
      console.log(`${ROOM_BASE_URL}/${roomId}`);
    });

    // 学生离开房间
    socketRef.current.on("student_leave_room", (id) => {
      setStudents((students) =>
        students.map((student) => {
          if (student.id === id) {
            student.connected = false;
          }
          return student;
        })
      );
    });

    // 学生答题
    socketRef.current.on("student_answer", ({ qid, aid, uid }) => {
      if (!answersRef.current[uid]) {
        answersRef.current[uid] = {};
      }
      answersRef.current[uid][qid] = aid;
    });

    socketRef.current.connect();

    // 清除监听，断开连接
    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("room_info");
      socketRef.current.off("student_leave_room");
      socketRef.current.off("student_answer");
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // 学生加入房间
    socketRef.current.on("student_join_room", (student) => {
      // 判断当前状态，发送恢复数据
      switch (currentState) {
        case "question":
          // 判断当前题目已答
          const studentAnswers = answersRef.current[student.id];
          if (studentAnswers) {
            const currentQuestionAnswer = studentAnswers[currentQuestion.id];
            if (currentQuestionAnswer !== undefined) break;
          }
          socketRef.current.emit("resume_room_state", student.id, {
            state: "question",
            data: currentQuestion,
          });
          break;
        case "scores":
          socketRef.current.emit("resume_room_state", student.id, {
            state: "scores",
            data: scores,
          });
      }
      setStudents((students) => {
        const index = students.findIndex((s) => s.id === student.id);
        if (index === -1) {
          student.connected = true;
          students.push(student);
          return [...students];
        }
        students[index].connected = true;
        return [...students];
      });
    });

    return () => {
      socketRef.current.off("student_join_room");
    };
  }, [currentState, currentQuestion, scores]);

  const step = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      const scores = { scores: calculateScores(), count: questions.length };
      socketRef.current.emit("scores", scores);
      setScores(scores);
      setCurrentState("scores");
      return;
    }
    const nextQuestion = questions[nextIndex];
    socketRef.current.emit("question", nextQuestion);
    setIndex(nextIndex);
    setCurrentState("question");
  };

  let content;

  switch (currentState) {
    case "waiting":
      content = (
        <div className="flex-grow flex justify-center items-center">
          <QRCodeCanvas value={`${ROOM_BASE_URL}/${roomId}`} size={300} />
        </div>
      );
      break;
    case "question":
      content = <QuestionState question={currentQuestion} />;
      break;
    case "scores":
      content = <ScoresState data={scores} />;
      break;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 h-screen flex bg-slate-50">
        <StudentList students={students} />
        <section className="flex-grow flex flex-col items-center overflow-auto">
          {content}
          {currentState !== "scores" && (
            <button
              className="w-80 py-4 mt-8 mb-16  rounded-md text-white text-lg bg-sky-500"
              onClick={step}
            >
              {currentState === "waiting" ? "开始游戏" : "下一题"}
            </button>
          )}
        </section>
      </main>
    </>
  );
};

export default QuizController;
