import React from "react";
import { MOCK_POSTS } from "../mock/posts";
import PostCard from "./PostCard";

const PostList = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
      }}
    >
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.slug} data={post} />
      ))}
    </div>
  );
};

export default PostList;
