import { useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const NormalState = ({ onNameChange, onJoin }) => {
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
        <li key={option.id} className="">
          <button
            className={`w-full h-full block rounded-md bg-[${option.color}]`}
            onClick={() => onAnswer({ qid: question.id, aid: option.id })}
          ></button>
        </li>
      ))}
    </ul>
  );
};

const Room = () => {
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);
  const [isJoin, setIsJoin] = useState(false);
  const { rid: roomId } = useParams();

  const joinRoom = () => {
    const socketIO = io();
    socketIO.on("connect", () => {
      console.log(socketIO.connected);
    });
    socketIO.emit("join-room", { roomId, name });
    socketIO.on("new-question", (q) => {
      setQuestion(q);
    });
    setIsJoin(true);
    setSocket(socketIO);
  };

  const answerQuestion = (answer) => {
    socket.emit("answer", { roomId, answer });
  };

  return isJoin ? (
    question && <QuestionState question={question} onAnswer={answerQuestion} />
  ) : (
    <NormalState onNameChange={setName} onJoin={joinRoom} />
  );
};

export default Room;
