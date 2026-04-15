import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ data }) => {
  return (
    <div className="post-card">
      <h3>
        <Link to={`/post/${data.slug}`}>{data.title}</Link>
      </h3>

      <p>{data.summary}</p>

      <Link to={`/post/${data.slug}`}>Đọc thêm...</Link>
    </div>
  );
};

export default PostCard;
