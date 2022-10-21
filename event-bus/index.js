const express = require("express");
const axios = require("axios");

const app = express();
const events = [];

app.use(express.json());

// this for anytime moderation server goes down
// and we already keep the unhandledEvents in an array
app.get("/events", (req, res) => {
  res.send(events);
  events.length = 0;
});

app.post("/events", async (req, res) => {
  // handle the unhandledEvents from moderation
  if (Array.isArray(req.body) && req.body.length) {
    req.body.forEach((event) => {
      axios.post("http://localhost:4000/events", event); // posts
      axios.post("http://localhost:4001/events", event); // comments
      axios.post("http://localhost:4004/events", event); // query
    });
  }
  // this is all the normal events
  const event = req.body;

  axios.post("http://localhost:4000/events", event); // posts
  axios.post("http://localhost:4001/events", event); // comments
  axios.post("http://localhost:4004/events", event); // query
  axios
    .post("http://localhost:4005/events", event) /* moderation */
    .catch(() => {
      // handle event when moderation server down
      if (event.type === "CommentCreated") {
        events.push(event);
      }
    });

  return res.send("ok");
});

app.listen(4003, () => console.log("event-bus listening on 4003"));
