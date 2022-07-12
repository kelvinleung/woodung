import { Routes, Route } from "react-router-dom";
import Login from "./teacher/Login";
import ProtectedRoute from "./common/ProtectedRoute";
import QuizEditor from "./teacher/QuizEditor";
import QuizList from "./teacher/QuizList";
import QuizController from "./teacher/QuizController";
import Room from "./student/Room";

const App = () => (
  <Routes>
    <Route path="/" element={<Login />}></Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/quiz/create" element={<QuizEditor />}></Route>
      <Route path="/quiz/edit/:id" element={<QuizEditor />}></Route>
      <Route path="/quizzes" element={<QuizList />}></Route>
      <Route path="/quiz/controller/:id" element={<QuizController />}></Route>
    </Route>
    <Route path="/room/:rid" element={<Room />}></Route>
    <Route path="*" element={<p>Not Found</p>}></Route>
  </Routes>
);

export default App;
