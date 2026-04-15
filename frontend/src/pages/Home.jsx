import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "1200px", padding: "20px" }}>
      <Outlet />
    </div>
  );
};

export default Home;
