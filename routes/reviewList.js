const { Router } = require("express");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
리뷰 목록 조회

TODO : 평점 추가
? populate 조건식 추가

TODO : 댓글 추가
TODO : 좋아요 추가
*/
router.get(
  "/:movieId",
  asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId })
      .populate("userRef")
      .populate("starRef", { starList: { $elemMatch: { movieId: movieId } } });

    if (reviews.length === 0) {
      res.status(404);
      res.json({
        fail: "리뷰가 존재하지 않습니다.",
      });
    }

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          author: review.userRef.name,
          title: review.title,
          content: review.content,
          star: review.starRef.starList[0].star,
          createdAt: moment(review.createdAt).fromNow(),
          updatedAt: moment(review.updatedAt).fromNow(),
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

module.exports = router;
