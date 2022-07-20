import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import request from "../../common/api";
import { useToast } from "../../hooks/useToast";
import { API_GET_ROOM_URL } from "../../common/constants";

const ROOM_SESSION_KEY = "woodong_room_session";

const WaitingState = ({ username, onNameChange, onJoin }) => {
  return (
    <div className="h-full p-4">
      <p className="h-1/2 flex justify-center items-center text-slate-500 text-3xl font-bold">
        W<span className="text-[#de1a35]">O</span>
        <span className="text-[#d29400]">O</span>
        <span className="text-[#145dc7]">D</span>
        <span className="text-[#227e0f]">O</span>NG
      </p>
      <section className="w-full h-1/2 flex flex-col justify-center items-center">
        <input
          type="text"
          value={username}
          placeholder="请输入你的昵称"
          className="mb-20 p-4 w-full bg-slate-100 rounded-md outline-none text-center"
          onChange={(e) => onNameChange(e.target.value)}
        />
        <button
          className="px-20 py-4 rounded-md text-white bg-sky-500"
          onClick={onJoin}
        >
          加入房间
        </button>
      </section>
    </div>
  );
};

const QuestionState = ({ question, onAnswer }) => {
  return (
    <div className="h-full p-4">
      <p className="h-1/2 p-4 flex justify-center items-center text-center text-xl">
        {question.description}
      </p>
      <ul className="h-1/2 flex-grow grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <li key={option.id}>
            <button
              className="w-full h-full p-4 block rounded-md text-white"
              style={{ backgroundColor: option.color }}
              onClick={() => onAnswer({ qid: question.id, aid: option.id })}
            >
              {option.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ScoresState = ({ scores, count }) => {
  return (
    <div className="h-full p-4 bg-slate-50">
      <ul>
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
    </div>
  );
};

const MessageState = () => {
  return (
    <div className="h-full p-4 flex flex-col justify-center items-center">
      <p className="text-3xl text-sky-500 font-bold">请耐心等待……</p>
    </div>
  );
};

const Room = () => {
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [scores, setScores] = useState(null);
  const [currentState, setCurrentState] = useState("waiting");
  const [session, setSession] = useState(null);
  const { rid: roomId } = useParams();
  const { toast } = useToast();

  const getSession = () => {
    // 读取本地缓存的 session
    const localSession = JSON.parse(localStorage.getItem(ROOM_SESSION_KEY));
    if (localSession) {
      // 判断缓存 session 的 roomId 是否一致
      if (localSession.roomId === roomId) {
        setSession(localSession);
        setName(localSession.username);
      } else {
        // 不一致则清楚本地缓存
        localStorage.removeItem(ROOM_SESSION_KEY);
      }
    }
  };

  const getRoomInfo = async () => {
    try {
      await request.get(API_GET_ROOM_URL, { params: { roomId } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getRoomInfo();
    getSession();

    const socketIO = io({ autoConnect: false });

    socketIO.on("connect", () => {
      toast.success("连接成功");
    });

    socketIO.on("question", (question) => {
      setQuestion(question);
      setCurrentState("question");
    });

    socketIO.on("scores", (scores) => {
      setScores(scores);
      setCurrentState("scores");
    });

    socketIO.on("disconnect", () => {
      toast.error("连接已断开");
    });

    socketIO.on("connect_error", (err) => {
      toast.error(err.message);
    });

    // 恢复状态
    socketIO.on("resume_room_state", ({ state, data }) => {
      switch (state) {
        case "question":
          setQuestion(data);
          setCurrentState(state);
          break;
        case "scores":
          setScores(data);
          setCurrentState(state);
      }
    });

    setSocket(socketIO);

    return () => socketIO.disconnect();
  }, []);

  const joinRoom = () => {
    if (session) {
      socket.auth = { sessionId: session.sessionId, role: "student" };
    } else {
      socket.auth = { username: name, role: "student" };
    }

    socket.connect();

    socket.emit("join_room", roomId, (response) => {
      if (response.code !== 0) {
        socket.disconnect();
        toast.error(response.message);
      } else {
        // 刷新本地缓存
        localStorage.setItem(ROOM_SESSION_KEY, JSON.stringify(response.data));
        setSession(response.data);
        setCurrentState("message");
      }
    });
  };

  const answerQuestion = (answer) => {
    socket.emit("answer", { roomId, answer });
    setCurrentState("message");
  };

  let content;

  switch (currentState) {
    case "waiting":
      content = (
        <WaitingState
          username={name}
          onNameChange={setName}
          onJoin={joinRoom}
        />
      );
      break;
    case "question":
      content = <QuestionState question={question} onAnswer={answerQuestion} />;
      break;
    case "scores":
      content = <ScoresState scores={scores.scores} count={scores.count} />;
      break;
    case "message":
      content = <MessageState />;
  }

  return <div className="max-w-[640px] h-screen m-auto">{content}</div>;
};

export default Room;
