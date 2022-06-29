import { Routes, Route } from "react-router-dom";
import Login from "./teacher/Login";
import QuizEditor from "./teacher/QuizEditor";
import QuizList from "./teacher/QuizList";
import ProtectedRoute from "./common/ProtectedRoute";

const App = () => (
  <Routes>
    <Route path="/" element={<Login />}></Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/editor" element={<QuizEditor />}></Route>
      <Route path="/quiz-list" element={<QuizList />}></Route>
    </Route>
  </Routes>
);

export default App;
