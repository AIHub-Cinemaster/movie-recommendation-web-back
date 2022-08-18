const { Router } = require("express");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
영화별 리뷰 목록 조회

TODO: 리뷰 정렬 (좋아요 > 리뷰/별점 > 별점)
TODO: 추천 알고리즘 수정

TODO : 댓글 추가
TODO : 리뷰 아이디 기준으로 CRUD 코드 리팩토링
*/
router.get(
  "/:movieId",
  asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId })
      .populate("userRef")
      .populate("starRef", { starList: { $elemMatch: { movieId: movieId } } })
      .populate("likeRef");

    console.log(reviews);

    const result = await Promise.all(
      reviews.map((review) => {
        console.log(review);
        let likeCount = review.likeRef.likeCount;

        if (likeCount >= 1) {
          likeCount = review.likeRef.likeCount;
        } else {
          likeCount = 0;
        }

        const data = {
          movieId: review.movieId, // 프론트 요청으로 추가
          reviewId: review.reviewId,
          shortId: review.userRef.shortId, // 프론트 요청으로 추가
          author: review.userRef.name,
          profileImg: review.userRef.profileImg,
          title: review.title,
          content: review.content,
          star: review.starRef.starList[0].star,
          createdAt: moment(review.createdAt).fromNow(),
          updatedAt: moment(review.updatedAt).fromNow(),
          likeCount: likeCount,
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
