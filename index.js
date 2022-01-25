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
  }
  if (type === "CommentCreated") {
    const { id, postId, content } = data;
    posts[postId].comments.push({ id, content });
  }
  console.table(posts);
  res.send({});
});

app.listen("4002", () => {
  console.log("Listening on 4002");
});
