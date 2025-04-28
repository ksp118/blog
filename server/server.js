const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const postsRouter = require("./routes/posts");
app.use("/api/posts", postsRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
