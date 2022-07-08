import { Routes, Route } from "react-router-dom";
import Login from "./teacher/Login";
import QuizEditor from "./teacher/QuizEditor";
import QuizList from "./teacher/QuizList";
import ProtectedRoute from "./common/ProtectedRoute";

const App = () => (
  <Routes>
    <Route path="/" element={<Login />}></Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/quiz/create" element={<QuizEditor />}></Route>
      <Route path="/quiz/edit/:id" element={<QuizEditor />}></Route>
      <Route path="/quizzes" element={<QuizList />}></Route>
    </Route>
  </Routes>
);

export default App;
