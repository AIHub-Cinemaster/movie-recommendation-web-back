const { Router } = require("express");
const { User } = require("../models");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
유저별 리뷰 조회
*/
router.get(
  "/user/:shortId",
  asyncHandler(async (req, res) => {
    const { shortId } = req.params;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(500);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviews = await Review.find({ userRef: authData }).populate(
      "userRef",
    );

    if (reviews.length === 0) {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
      return;
    }

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          movieId: review.movieId,
          author: review.userRef.name,
          title: review.title,
          content: review.content,
          createdAt: moment(review.createdAt).format("YYYY년 M월 D일"),
          updatedAt: moment(review.updatedAt).format("YYYY년 M월 D일"),
        };
        return data;
      }),
    );

    if (result) {
      res.json(result);
    }
    return;
  }),
);

/*
* Create.
리뷰 작성
*/
router.post(
  "/add",
  asyncHandler(async (req, res) => {
    const { movieId, shortId, title, content } = req.body;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    if (reviewData) {
      res.status(400);
      res.json({
        fail: "이미 작성한 리뷰가 존재합니다.",
      });
    } else {
      await Review.create({
        userRef: authData,
        movieId: movieId,
        title: title,
        content: content,
      });

      res.json({
        result: "리뷰가 작성되었습니다.",
      });
    }
  }),
);

/*
* Update.
리뷰 수정
*/
router.post(
  "/update",
  asyncHandler(async (req, res) => {
    const { movieId, shortId, title, content } = req.body;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    if (reviewData) {
      await Review.findOneAndUpdate(
        {
          $and: [{ userRef: authData }, { movieId }],
        },
        { title, content },
      );

      res.json({
        result: "리뷰가 수정되었습니다.",
      });
    } else {
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
    }
  }),
);

/*
* Delete.
리뷰 삭제
*/
router.post(
  "/delete",
  asyncHandler(async (req, res) => {
    const { shortId, movieId } = req.body;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    if (!reviewData) {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
    }

    await Review.deleteOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    res.json({
      result: "리뷰가 삭제되었습니다.",
    });
  }),
);

module.exports = router;
