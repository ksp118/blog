import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContentListDisplayer.css";

function ContentListDisplayer({ contentName }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("failed to load data");
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="content-list-displayer-container">
      <div className="content-name">
        <h1>{contentName}</h1>
      </div>
      <div className="content-list">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContentListDisplayer;
