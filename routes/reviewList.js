const { Router } = require("express");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
리뷰 목록 조회

TODO : 댓글 추가
TODO : 좋아요 추가
TODO : 리뷰 정렬 (좋아요 > 리뷰/별점 > 별점)
*/
router.get(
  "/:movieId",
  asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId })
      .populate("userRef")
      .populate("starRef", { starList: { $elemMatch: { movieId: movieId } } });

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          shortId: review.userRef.shortId, // 프론트 요청으로 추가
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
