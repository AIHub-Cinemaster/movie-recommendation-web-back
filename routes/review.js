const { Router } = require("express");
const { User } = require("../models");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

const router = Router();

// 리뷰 목록 조회
// TODO : 유저가 작성한 리뷰 조회
router.get(
  "/:movieId",
  asyncHandler(async (req, res, next) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId }).populate("userRef");
    if (reviews.length === 0) {
      return null;
    }

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          movieId: review.movieId,
          author: review.userRef.name,
          title: review.title,
          content: review.content,

          // TODO : 한국시간(UTC +9) 시간 설정
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,

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
// TODO : 영화 한 편당 리뷰 한 개 제한 -> 중복 리뷰 X
router.post(
  "/add",
  asyncHandler(async (req, res, next) => {
    const { movieId, email, title, content } = req.body;

    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    await Review.create({
      userRef: authData,
      movieId,
      title,
      content,
    });

    res.json({
      result: "리뷰가 작성되었습니다.",
    });
  }),
);

// 리뷰 수정
router.post(
  "/update",
  asyncHandler(async (req, res, next) => {
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
  asyncHandler(async (req, res, next) => {
    const { email, movieId } = req.body;

    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    await Review.deleteOne({
      $and: [{ email }, { movieId }],
    });

    // TODO : 작성한 리뷰가 없을 때 삭제 요청 시 예외 처리
    res.json({
      result: "리뷰가 삭제되었습니다.",
    });
  }),
);

module.exports = router;
