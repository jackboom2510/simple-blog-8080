import React from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { slug } = useParams();
  return (
    <div>
      <h2>Chi tiết bài viết</h2>
      <p>Slug: {slug}</p>
    </div>
  );
};

export default PostDetail;
