import { useEffect, useState } from "react";
import { io } from "socket.io-client";

/* TODO:
   - 断开重连
   - 页面交互
*/

// TODO: 输入房间号加入
const roomId = "ca5a96f5-3c75-4af3-b66a-fa1eefde3604";

function Student() {
  const [name, setName] = useState();
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const newSocket = io();
    newSocket.on("connect", () => {
      console.log(newSocket.connected);
    });
    setSocket(newSocket);
  }, []);

  const joinRoom = () => {
    socket.emit("join-room", { roomId, name });
    socket.on("new-question", (q) => {
      setQuestion(q);
    });
  };

  const answerQuestion = (answer) => {
    socket.emit("answer", { roomId, answer });
  };

  return (
    <div>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button onClick={joinRoom}>加入房间</button>
      {question && (
        <div>
          <p>{question.question}</p>
          <div>
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  answerQuestion({ qid: question.id, aid: option.id })
                }
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Student;
