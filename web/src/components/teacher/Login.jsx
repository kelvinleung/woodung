import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { HOME_URL, API_LOGIN_URL } from "../../common/constants";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectURL = (location.state && location.state.from) || HOME_URL;
  const { user, saveUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(HOME_URL);
    }
  }, []);

  async function login(e) {
    e.preventDefault();
    try {
      const response = await axios.post(API_LOGIN_URL, { username, password });
      if (response.data.code === 0) {
        saveUser(response.data.token);
        navigate(redirectURL);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-w-[1080px] min-h-screen bg-white">
      <h1 className="text-sky-500 text-4xl mb-8">Woodong</h1>
      <form
        className="px-8 py-12 flex flex-col gap-8 w-full max-w-sm bg-white/20 rounded-lg"
        onSubmit={login}
      >
        <input
          className="p-4 rounded-md bg-sky-50/60 focus:bg-sky-50 text-neutral-800 outline-none placeholder:text-neutral-300"
          type="text"
          autoComplete="username"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="p-4 rounded-md bg-sky-50/60 focus:bg-sky-50 text-neutral-800 outline-none placeholder:text-neutral-300"
          type="password"
          autoComplete="current-password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="py-4 rounded-xl text-white bg-sky-500" type="submit">
          登录
        </button>
      </form>
    </div>
  );
};

export default Index;
