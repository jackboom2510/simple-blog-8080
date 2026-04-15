import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Stats from "../pages/Stats";
import NewPost from "../pages/NewPost";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import ProtectedRoute from "./ProtectedRoute";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route element={<Home />}>
              <Route index element={<PostList />} />
              <Route path="post/:slug" element={<PostDetail />} />
            </Route>

            <Route path="new-post" element={<NewPost />} />
            <Route path="about" element={<About />} />
            <Route path="stats" element={<Stats />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default MainLayout;
