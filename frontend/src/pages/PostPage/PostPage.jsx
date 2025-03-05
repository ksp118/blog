import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../../components/common/Header";
import MarkdownRenderer from "../../components/MDRenderer/MarkdownRenderer";

import { getPostById } from "../../api/api";

import "./PostPage.css";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPostById(id);
      if (postData) {
        setPost(postData);
      }
    };
    fetchPost();
  }, [id]);

  if (!post.title) return <p>Loading...</p>;

  const postCreatedAt = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(post.created_at));

  return (
    <div className="postpage-container">
      <Header />
      <div className="postpage-postarea">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-created_at">{postCreatedAt}</p>
        <hr></hr>
        <div className="post-content">
          <MarkdownRenderer content={post.content}></MarkdownRenderer>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
