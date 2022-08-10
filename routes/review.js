const { Router } = require("express");
const { User } = require("../models");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

// 리뷰 목록 조회
// TODO : 유저가 작성한 리뷰 조회
router.get(
  "/:movieId",
  asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId }).populate("userRef");
    if (reviews.length === 0) {
      return null;
    }

    console.log(reviews);

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          movieId: review.movieId,
          author: review.userRef.name,
          title: review.title,
          content: review.content,

          // TODO : 날짜 포맷 프론트랑 논의
          createdAtKST: moment(review.createdAt).format("YYYY년 M월 D일"),
          updatedAtKST: moment(review.updatedAt).format("YYYY년 M월 D일"),

          // TODO : 댓글, 좋아요 추가
        };
        return data;
      }),
    );

    if (result) {
      res.json(result);
      console.log("res.json(result);: ", result);
    } else {
      res.status(500);
      res.json({
        fail: "리뷰가 존재하지 않습니다.",
      });
    }
  }),
);

// 리뷰 작성
router.post(
  "/add",
  asyncHandler(async (req, res) => {
    const { movieId, email, title, content } = req.body;

    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({
      $and: [{ email }, { movieId }],
    });

    if (reviewData) {
      res.status(400);
      res.json({
        fail: "작성한 리뷰가 이미 존재합니다.",
      });
    }

    /*
    * 중복 방지
    { upsert: true } 속성을 주면 DB에 값이 없는 경우에만 생성
    */
    await Review.findOneAndUpdate(
      { userRef: authData, movieId: movieId, title: title, content: content },
      { userRef: authData, movieId: movieId, title: title, content: content },
      { upsert: true },
    );

    res.json({
      result: "리뷰가 작성되었습니다.",
    });
  }),
);

// 리뷰 수정
router.post(
  "/update",
  asyncHandler(async (req, res) => {
    const { movieId, email, title, content } = req.body;

    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    await Review.findOneAndUpdate(
      {
        $and: [{ email }, { movieId }],
      },
      { title, content },
    );

    res.json({
      result: "리뷰 수정이 완료되었습니다.",
    });
  }),
);

// 리뷰 삭제
router.post(
  "/delete",
  asyncHandler(async (req, res) => {
    const { email, movieId } = req.body;

    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({
      $and: [{ email }, { movieId }],
    });

    if (!reviewData) {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
    }

    await Review.deleteOne({
      $and: [{ email }, { movieId }],
    });

    res.json({
      result: "리뷰가 삭제되었습니다.",
    });
  }),
);

module.exports = router;
