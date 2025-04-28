const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const postsRouter = require("./routes/posts");
app.use("/api/posts", postsRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
