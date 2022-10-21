const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
const commentsByPostId = {};

app.use(express.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;
  res.send(commentsByPostId[postId] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { id: postId } = req.params;
  const { content } = req.body;
  const comments = commentsByPostId[postId] || [];
  const status = "pending"; // default

  comments.push({ id, content, status });
  commentsByPostId[postId] = comments;

  await axios.post(`http://localhost:4003/events`, {
    type: "CommentCreated",
    data: { id, content, status, postId },
  });

  res.send(commentsByPostId[postId]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body);
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId } = data;
    const index = commentsByPostId[postId].findIndex((c) => c.id === data.id);
    const comment = commentsByPostId[postId][index];
    comment.status = data.status;

    axios.post("http://localhost:4003/events" /* event-bus url */, {
      type: "CommentUpdated",
      data: { ...comment, postId },
    });
  }

  return res.send({ message: "ok" });
});

app.listen(4001, () => {
  console.log("comments listening on 4001");
});
