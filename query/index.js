const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  return res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const index = posts[postId].comments.findIndex((c) => c.id === id);
    posts[postId].comments[index] = { id, content, status };
  }

  return res.send({ message: "ok" });
});

app.listen(4004, () => {
  console.log("query listening on 4004");
});
