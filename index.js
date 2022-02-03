const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, postId, content, status } = data;
    posts[postId].comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId, status, content } = data;
    const post = posts[postId];
    const comment = post.comments.find((c) => c.id === id);

    // we are already mutating the original object (pass by reference)
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  return res.send(posts);
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  console.dir(posts, { depth: null });
  res.send({});
});

app.listen("4002", async () => {
  console.log("Listening on 4002");

  try {
    const res = await axios.get("http://e-bus-service:4005/events");
    for (let event of res.data) {
      console.log("Processing Event", event.type);
      handleEvents(event.type, event.data);
    }
  } catch (err) {
    console.log(err.message);
  }
});
