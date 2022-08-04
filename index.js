const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const movieCartRouter = require("./routes/movieCart");
const starRatingRouter = require("./routes/starRating");

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
app.use("/cart", movieCartRouter);

app.use("/star", starRatingRouter);
app.listen(8090, () => {
  console.log("server open");
});
