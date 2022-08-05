const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const starRouter = require("./routes/star");

const authMiddleware = require("./utils/authMiddleware");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

//DB 연결
mongoose.connect("mongodb://localhost:27017/Cinemaster");

mongoose.connection.on("connected", () => {
  console.log("DB connect success");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//user url 경로 라우팅
app.use("/user", userRouter);
//app.use("/cart", authMiddleware, movieCartRouter);
app.use("/cart", cartRouter);

app.use("/star", starRouter);
app.listen(8090, () => {
  console.log("server open");
});
