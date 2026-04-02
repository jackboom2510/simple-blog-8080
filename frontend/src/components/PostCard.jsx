import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ data }) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <h3>
        <Link to={`/post/${data.slug}`}>{data.title}</Link>
      </h3>

      <p>{data.summary}</p>

      <Link to={`/post/${data.slug}`}>Đọc thêm...</Link>
    </div>
  );
};

export default PostCard;
