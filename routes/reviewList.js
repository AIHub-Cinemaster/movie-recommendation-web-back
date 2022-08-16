const { Router } = require("express");
const { Review } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
<<<<<<< HEAD
리뷰 목록 조회

TODO : 댓글 추가
TODO : 좋아요 추가
TODO : 리뷰 정렬 (좋아요 > 리뷰/별점 > 별점)
=======
영화별 리뷰 목록 조회

TODO : 댓글 추가
TODO : 리뷰 정렬 (좋아요 > 리뷰/별점 > 별점)

TODO: 리뷰 조회 시 좋아요 개수 Response
TODO: 프로필 이미지 경로 Response
TODO: 리뷰 수정 시 기존에 작성했던 리뷰 보여주기
TODO: 추천 알고리즘 수정
TODO: 리뷰 아이디 기준으로 CRUD 코드 리팩토링
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
*/
router.get(
  "/:movieId",
  asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId: movieId })
      .populate("userRef")
<<<<<<< HEAD
      .populate("starRef", { starList: { $elemMatch: { movieId: movieId } } });

    const result = await Promise.all(
      reviews.map((review) => {
        const data = {
          shortId: review.userRef.shortId, // 프론트 요청으로 추가
          author: review.userRef.name,
=======
      .populate("starRef", { starList: { $elemMatch: { movieId: movieId } } })
      .populate("likeRef");

    const result = await Promise.all(
      reviews.map((review) => {
        let likeCount = review.likeRef.likeCount;

        if (likeCount >= 1) {
          likeCount = review.likeRef.likeCount;
        } else {
          likeCount = 0;
        }

        // if (isEmptyObject(likeCount)) {
        //   likeCount = review.likeRef.likeCount;
        //   console.log("true");
        // } else {
        //   // likeCount = 0;
        //   console.log("------------------------------------");
        //   console.log("false");
        //   console.log("------------------------------------");
        //   console.log(likeCount.length);
        //   console.log(typeof likeCount);
        // }

        const data = {
          movieId: review.movieId, // 프론트 요청으로 추가
          reviewId: review.shortId,
          shortId: review.userRef.shortId, // 프론트 요청으로 추가
          author: review.userRef.name,
          profileImg: review.userRef.profileImg,
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
          title: review.title,
          content: review.content,
          star: review.starRef.starList[0].star,
          createdAt: moment(review.createdAt).fromNow(),
          updatedAt: moment(review.updatedAt).fromNow(),
<<<<<<< HEAD
=======
          likeCount: likeCount,
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
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
