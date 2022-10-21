import { useState, useEffect } from "react";
import axios from "axios";
import PostCreate from "./components/PostCreate";
import PostList from "./components/PostList";

function App() {
  const [newPost, setNewPost] = useState(undefined);
  const [newComment, setNewComment] = useState(undefined);
  const [posts, setPosts] = useState(undefined);
  const endpoint = "http://localhost:";
  const getApiEndpoint = endpoint + 4004 + "/posts";
  const postApiEndpoint = endpoint + 4000;
  const commentApiEndpoint = endpoint + 4001;

  useEffect(() => {
    (async () => {
      async function createPost() {
        if (newPost) {
          await axios.post(`${postApiEndpoint}/posts`, newPost);
          setNewPost(undefined);
        }
      }
      async function createComment() {
        if (newComment) {
          await axios.post(`${commentApiEndpoint}/posts/${newComment.postId}/comments`, newComment.comment);
          setNewComment(undefined);
        }
      }
      async function getPosts() {
        const response = await axios.get(getApiEndpoint);
        console.log("wey");
        setPosts(response.data);
      }
      await createPost();
      await createComment();
      await getPosts();
    })();
  }, [newPost, newComment]);

  function postInputHandler(event) {
    if (event.key === "Enter" && event.target.value) {
      setNewPost({ title: event.target.value });
      event.target.value = "";
    }
  }
  function commentInputHandler(event, postId) {
    if (event.key === "Enter" && event.target.value) {
      setNewComment({ comment: { content: event.target.value }, postId });
      event.target.value = "";
    }
  }
  let postList;

  if (posts === undefined) {
    postList = <p>Loading...</p>;
  } else if (!Object.keys(posts).length) {
    postList = <p>No post found</p>;
  } else {
    postList = <PostList posts={posts} commentInputHandler={commentInputHandler} />;
  }
  return (
    <div className="card">
      <p>Me from React</p>
      <PostCreate onKeyUp={postInputHandler} />
      {postList}
    </div>
  );
}

export default App;
