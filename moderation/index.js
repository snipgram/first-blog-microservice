const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

function moderateComment(content) {
  return content.toLowerCase().includes("rain") ? "rejected" : "approved";
}

(async () => {
  const response = await axios.get("http://localhost:4003/events" /* event-bus url */);
  const unhandledEvents = response.data;

  unhandledEvents.forEach((event) => {
    const { type, data } = event;

    if (type === "CommentCreated") {
      data.status = moderateComment(data.content);
      event.type = "CommentModerated";
    }
  });
  axios.post("http://localhost:4003/events" /* event-bus url */, unhandledEvents);
})();

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = moderateComment(data.content);

    axios.post("http://localhost:4003/events" /* event-bus url */, {
      type: "CommentModerated",
      data: { ...data, status },
    });
  }

  return res.send({ message: "ok" });
});

app.listen(4005, () => {
  console.log("moderation listening on 4005");
});
