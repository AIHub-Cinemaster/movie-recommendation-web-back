const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const starRouter = require("./routes/star");
const fileUploadRouter = require("./routes/fileUpload");
const kakaoRouter = require("./routes/oauth/kakao");
const naverRouter = require("./routes/oauth/naver");
const reviewRouter = require("./routes/review");
const recommendRouter = require("./routes/recommend");

const authMiddleware = require("./utils/authMiddleware");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use("/uploads", express.static("uploads"));

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

//auth url 경로 라우팅
app.use("/auth/kakao", kakaoRouter);
app.use("/auth/naver", naverRouter);

// review url 경로 라우팅
app.use("/review", reviewRouter);

// recommend url 경로 라우팅
app.use("/recommend", recommendRouter);
app.use("/upload", fileUploadRouter);
app.listen(8090, () => {
  console.log("server open");
});
