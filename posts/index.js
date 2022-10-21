const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
const posts = {};

app.use(express.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  await axios.post("http://localhost:4003/events", {
    type: "PostCreated",
    data: posts[id],
  });
  return res.send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body);
});

app.listen(4000, () => {
  console.log("posts listening on 4000");
});
