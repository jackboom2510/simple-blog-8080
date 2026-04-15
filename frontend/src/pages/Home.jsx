  import React from "react";
  import { Outlet } from "react-router-dom";

  const Home = () => {
    return (
      <div className="home-container">
        <Outlet />
      </div>
    );
  };

  export default Home;
