import axios from "axios";

export const getPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/posts");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
