import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Home />}>
            <Route index element={<PostList />} />
            <Route path="post/:slug" element={<PostDetail />} />
          </Route>

          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}
