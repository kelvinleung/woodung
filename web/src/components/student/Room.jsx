import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const ROOM_SESSION_KEY = "woodong_room_session";

const WaitingState = ({ username, onNameChange, onJoin }) => {
  return (
    <div className="max-w-[640px] h-screen m-auto p-8 flex flex-col">
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
    <ul className="max-w-[640px] min-h-screen m-auto p-8 grid grid-cols-2 gap-4">
      {question.options.map((option) => (
        <li key={option.id}>
          <button
            className="w-full h-full block rounded-md"
            style={{ backgroundColor: option.color }}
            onClick={() => onAnswer({ qid: question.id, aid: option.id })}
          ></button>
        </li>
      ))}
    </ul>
  );
};

const MessageState = () => {
  return (
    <div className="max-w-[640px] h-screen m-auto p-8 flex flex-col justify-center items-center text-3xl text-sky-500 font-bold">
      <p>请耐心等待……</p>
    </div>
  );
};

const Room = () => {
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [currentState, setCurrentState] = useState("waiting");
  const [sessionId, setSessionId] = useState(null);
  const { rid: roomId } = useParams();

  const getSession = () => {
    const session = JSON.parse(localStorage.getItem(ROOM_SESSION_KEY));
    if (session) {
      setSessionId(session.sessionId);
      setName(session.username);
    }
  };

  useEffect(() => {
    getSession();

    const socketIO = io({ autoConnect: false });

    socketIO.on("connect", () => {
      console.log(socketIO.connected);
    });

    socketIO.on("new_question", (q) => {
      setQuestion(q);
      setCurrentState("question");
    });

    socketIO.on("disconnect", () => {
      alert("连接已断开");
    });

    socketIO.on("error", (err) => {
      console.log(err);
    });

    setSocket(socketIO);

    return () => socketIO.disconnect();
  }, []);

  const joinRoom = () => {
    if (sessionId) {
      socket.auth = { sessionId, role: "student" };
    } else {
      socket.auth = { username: name, role: "student" };
    }
    socket.connect();
    socket.emit("join_room", roomId, (response) => {
      if (response.code !== 0) {
        socket.disconnect();
        alert(response.message);
      } else {
        if (sessionId === null) {
          localStorage.setItem(ROOM_SESSION_KEY, JSON.stringify(response.data));
          setSessionId(response.data.sessionId);
        }
        setCurrentState("message");
      }
    });
  };

  const answerQuestion = (answer) => {
    socket.emit("answer", { roomId, answer });
    setCurrentState("message");
  };

  switch (currentState) {
    case "waiting":
      return (
        <WaitingState
          username={name}
          onNameChange={setName}
          onJoin={joinRoom}
        />
      );
    case "question":
      return <QuestionState question={question} onAnswer={answerQuestion} />;
    case "message":
      return <MessageState />;
  }
};

export default Room;
