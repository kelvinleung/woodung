import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const WaitingState = ({ onNameChange, onJoin }) => {
  return (
    <div className="max-w-[640px] min-h-screen m-auto p-8 flex flex-col justify-center items-center">
      <input
        type="text"
        placeholder="请输入你的昵称"
        className="mb-20 p-4 w-full bg-slate-100 rounded-md outline-none text-center"
        onChange={(e) => onNameChange(e.target.value)}
      />
      <button
        className="px-20 py-4 flex flex-shrink-0 items-center rounded-md text-white bg-sky-500"
        onClick={onJoin}
      >
        加入房间
      </button>
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
    <div className="max-w-[640px] min-h-screen m-auto p-8 flex flex-col justify-center items-center">
      <p>请耐心等待</p>
    </div>
  );
};

const Room = () => {
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [currentState, setCurrentState] = useState("waiting");
  const { rid: roomId } = useParams();

  useEffect(() => {
    const socketIO = io({ autoConnect: false });

    socketIO.on("connect", () => {
      console.log(socketIO.connected);
    });

    socketIO.on("new_question", (q) => {
      setQuestion(q);
      setCurrentState("question");
    });

    setSocket(socketIO);

    return () => socketIO.disconnect();
  }, []);

  const joinRoom = () => {
    socket.auth = { username: name, role: "student" };
    socket.connect();
    socket.emit("join_room", roomId, (response) => {
      if (response.code !== 0) {
        socket.disconnect();
        alert(response.message);
      } else {
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
      return <WaitingState onNameChange={setName} onJoin={joinRoom} />;
    case "question":
      return <QuestionState question={question} onAnswer={answerQuestion} />;
    case "message":
      return <MessageState />;
  }
};

export default Room;
