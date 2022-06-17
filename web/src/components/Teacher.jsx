import { useEffect, useState } from "react";
import { io } from "socket.io-client";

/* TODO:
   - 创建题目
   - 断开重连
   - 页面交互
*/

// TODO: 随机生成
const roomId = "zwowH3wix";

// TODO: 存数据库，通过接口拿数据
const quiz = [
  {
    id: 1,
    question: "1+1=?",
    answers: [
      { id: 0, text: "0" },
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "3" },
    ],
  },
  {
    id: 2,
    question: "乾隆的儿子是谁",
    answers: [
      { id: 0, text: "雍正" },
      { id: 1, text: "康熙" },
      { id: 2, text: "嬴政" },
      { id: 3, text: "朱元璋" },
    ],
  },
];

function TeacherIndex() {
  const [socket, setSocket] = useState(null);
  const [students, setStudents] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  // TODO: 计算得分
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const newSocket = io();

    // 连接状态
    newSocket.on("connect", () => {
      console.log(newSocket.connected);
    });

    // 学生加入房间
    newSocket.on("student-join-room", (student) => {
      setStudents((students) => [...students, student]);
    });

    // 学生离开房间
    newSocket.on("student-leave-room", (id) => {
      setStudents((students) =>
        students.filter((student) => student.id !== id)
      );
    });

    // 学生答题
    newSocket.on("student-answer", ({ qid, aid, uid }) => {
      setAnswers((answers) => {
        if (!answers[uid]) {
          answers[uid] = {};
        }
        answers[uid][qid] = aid;
        console.log(answers);
        return answers;
      });
    });

    setSocket(newSocket);
  }, []);

  const openRoom = () => {
    socket.emit("open-room", roomId);
  };

  const nextQuestion = () => {
    if (quizIndex >= quiz.length) return;
    socket.emit("question", quiz[quizIndex]);
    setQuizIndex(quizIndex + 1);
  };

  return (
    <div>
      <h1>房间号：{roomId || "未连接"}</h1>
      <button onClick={openRoom}>开启房间</button>
      <button onClick={nextQuestion}>下一题</button>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherIndex;
