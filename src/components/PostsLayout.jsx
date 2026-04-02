import React from "react";
import { Outlet } from "react-router-dom";

const PostsLayout = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Blog của tôi</h1>
      <Outlet />
    </div>
  );
};

export default PostsLayout;
