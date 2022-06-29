import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../hooks/useAuth";

const LOGIN_URL = "/api/v1/login";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, { username, password });
      if (response.data.code === 0) {
        console.log(response.data);
        saveUser(response.data.token);
        navigate("/quiz-list");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="teacher-index__container">
      <form className="teacher-index__login-form" onSubmit={login}>
        <input
          type="text"
          autoComplete="username"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="teacher-index__button" type="submit">
          登录
        </button>
      </form>
    </div>
  );
};

export default Index;
