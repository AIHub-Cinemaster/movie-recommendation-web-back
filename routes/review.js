const { Router } = require("express");
const { User } = require("../models");
const { Review } = require("../models");
const { Star } = require("../models");
const { Like } = require("../models");
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

    const reviewData = await Review.find({ userRef: authData })
      .populate("userRef")
      .populate("starRef")
      .populate("likeRef");

    if (!reviewData) {
      res.json(0);
    } else {
      // * 프론트 요청
      // * 리뷰 조회 시 리뷰 유/무 유효성 검사 삭제

      // ! 리뷰 유효성 검사
      if (reviewData.length === 0) {
        // res.status(404);
        res.json({
          success: false,
          result: "유저는 존재하지만, 작성한 리뷰가 존재하지 않습니다.",
        });
        return;
      }

      const starData = await Star.findOne({ userRef: authData });

      const result = await Promise.all(
        reviewData.map((review) => {
          let star = starData.starList.find((element) => {
            if (element.movieId === review.movieId) {
              return true;
            }
          });

          /*
          리뷰는 작성했지만 별점은 등록하지 않았을 때,
          별점 기본값을 0으로 설정
          */
          if (!star) {
            star = 0;
          } else {
            star = star.star;
          }

          /*
           * 프론트 요청
           * 유저별 리뷰 조회 시 유저의 좋아요 유/무 판별을 위해
           * 각 리뷰 데이터에 좋아요 누른 유저를 배열로 추가
           */
          const likeUsers = review.likeRef.likeUsers;
          let userList = [];

          likeUsers.map((user) => {
            userList.push(user.user);
          });

          let likeCount = review.likeRef.likeCount;

          if (likeCount >= 1) {
            likeCount = review.likeRef.likeCount;
          } else {
            likeCount = 0;
          }

          const data = {
            movieId: review.movieId,
            reviewId: review.reviewId,
            shortId: review.userRef.shortId, // 프론트 요청으로 추가
            author: review.userRef.name,
            profileImg: review.userRef.profileImg,
            title: review.title,
            content: review.content,
            star: star,
            createdAt: moment(review.createdAt).fromNow(),
            updatedAt: moment(review.updatedAt).fromNow(),
            likeUsers: userList,
            likeCount: likeCount,
          };
          return data;
        }),
      );

      if (result) {
        res.json(result);
      }
      return;
    }
  }),
);

/*
* Create.
리뷰 작성

//! HotFix: title, content 빈 값으로 요청 시 에러 발생
  -> "../models/review" 수정
  -> mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');
*/
router.post(
  "/add",
  asyncHandler(async (req, res) => {
    const { movieId, shortId, title, content, star } = req.body;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    /*
    * Create.
    별점 자체를 최초 등록
    */
    const checkStar = await Star.findOne({ userRef: authData });

    if (!checkStar) {
      await Star.create({
        userRef: authData,
        starList: [
          {
            movieId,
            star,
          },
        ],
      });
    } else {
      /*
      * Update.
      별점 자체를 등록한 적이 있지만
      해당 영화를 별점이 매긴 적이 있는지 없는지로 구분 된다
      */

      const starData = await Star.findOne({ userRef: authData });

      const starList = checkStar.starList;

      const callFindIndex = (element) => {
        return element.movieId == movieId;
      };

      const findIndex = starList.findIndex(callFindIndex);

      if (findIndex < 0) {
        // 기존에 평점을 매겼던 적 없는 영화라면
        const newStarist = [
          ...starList,
          {
            movieId,
            star,
          },
        ];

        await Star.updateOne(
          { userRef: authData },
          {
            starList: newStarist,
          },
        );
      } else {
        // 기존에 평점을 매겼던 영화라면
        starList[findIndex].star = star;

        await Star.updateOne(
          { userRef: authData },
          {
            starList,
          },
        );
      }

      /*
      * 프론트 요청
      * 리뷰 유/무 유효성 검사 삭제
      const reviewData = await Review.findOne({
        $and: [{ userRef: authData }, { movieId }],
      });
      */

      const reviewData = await Review.findOne({
        $and: [{ userRef: authData }, { movieId }],
      });

      if (reviewData)
        return res.json({ result: "이미 작성한 리뷰가 존재합니다." });

      await Review.create({
        userRef: authData,
        movieId: movieId,
        title: title,
        content: content,
        starRef: starData,
      });

      // ! TEST 중
      // res.json({
      //   result: "리뷰가 작성되었습니다.",
      // });

      /*
       * 리뷰 작성 후 작성된 리뷰의 "shortId" 기준으로 좋아요 Documnet 생성
       * 생성된 좋아요 Document를 리뷰 Document 내 "likeRef"에 참조하여 추가
       */

      // 리뷰 작성 후 작성된 "reviewId" 검색
      const newReviewData = await Review.findOne({
        $and: [{ userRef: authData }, { movieId }],
      });

      // "reviewId"를 포함하여 좋아요 Document 생성
      await Like.create({
        reviewRef: newReviewData,
        likeCount: 0,
        likeUsers: [],
      });

      // "reviewId"를 담는 변수
      const reviewId = newReviewData.reviewId;

      // 좋아요 Collection에서 작성된 리뷰 Document를 기준으로 검색
      // 검색된 좋아요 Document를 "likeData" 변수에 할당
      const likeData = await Like.findOne({ reviewRef: newReviewData });

      // 리뷰 Collection에서 "reviewId"를 기준으로 검색
      // 검색된 리뷰 Document에 좋아요 Document를 새로 추가

      /*
       * 리뷰 조회 후 성공 시 response 응답
       */
      await Review.findOneAndUpdate(
        { reviewId: reviewId },
        { $set: { likeRef: likeData } },
      ).then(res.json({ result: "리뷰가 작성되었습니다." }));
    }

    // let tmp = (msg) =>
    //   new Promise((resolve) => {
    //     setTimeout(() => {
    //       console.log(msg);
    //       resolve("tmp");
    //       res.json({
    //         result: "리뷰가 작성되었습니다.",
    //       });
    //     });
    //   }, 5000);
    // tmp(1);
  }),
);

/*
* Update.
리뷰 수정

완료 TODO : 리뷰 수정 시 기존 내용 보이게
*/
router.post(
  "/update",
  asyncHandler(async (req, res) => {
    const { movieId, shortId, title, content, star } = req.body;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const starData = await Star.findOne({ userRef: authData });

    const starList = starData.starList;

    const callFindIndex = (element) => {
      return element.movieId == movieId;
    };

    const findIndex = starList.findIndex(callFindIndex);

    starList[findIndex].star = star;

    const reviewData = await Review.findOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    if (reviewData) {
      await Review.findOneAndUpdate(
        {
          $and: [{ userRef: authData }, { movieId }],
        },
        { title, content, starRef: starData },
      );

      await Star.updateOne({ userRef: authData }, { starList });

      res.json({
        result: "리뷰가 수정되었습니다.",
      });
    } else {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
    }
  }),
);

/*
* Read.
리뷰 수정 시 기존에 작성했던 리뷰 조회 기능
*/
router.get(
  "/find/:shortId/:reviewId",
  asyncHandler(async (req, res) => {
    const { shortId, reviewId } = req.params;

    const authData = await User.findOne({ shortId });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const reviewData = await Review.findOne({ reviewId })
      .populate("userRef")
      .populate("starRef")
      .populate("likeRef");

    console.log(reviewData);

    const movieId = reviewData.movieId;

    const starData = await Star.findOne(
      { userRef: authData },
      { starList: { $elemMatch: { movieId: movieId } } },
    );
    console.log(starData);

    let star = starData.starList[0].star;
    console.log(별);

    /*
    리뷰는 작성했지만 별점은 등록하지 않았을 때,
    별점 기본값을 0으로 설정
    */
    if (!star) {
      star = 0;
    }

    let likeCount = reviewData.likeRef.likeCount;

    if (likeCount >= 1) {
      likeCount = reviewData.likeRef.likeCount;
    } else {
      likeCount = 0;
    }

    const result = {
      movieId: movieId,
      reviewId: reviewData.reviewId,
      shortId: reviewData.userRef.shortId,
      author: reviewData.userRef.name,
      profileImg: reviewData.userRef.profileImg,
      title: reviewData.title,
      content: reviewData.content,
      star: star,
      createdAt: moment(reviewData.createdAt).fromNow(),
      updatedAt: moment(reviewData.updatedAt).fromNow(),
      likeCount: likeCount,
    };

    if (result) {
      res.json(result);
    }
    return;
  }),
);

/*
* Delete.
리뷰 삭제

! FIXME: 리뷰 삭제 시 좋아요도 삭제
// ! HotFix : 리뷰 삭제 시 평점도 삭제
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
    })
      .populate("starRef")
      .populate("likeRef");

    console.log(reviewData);

    if (!reviewData) {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
      });
    }

    // 리뷰 삭제
    await Review.deleteOne({
      $and: [{ userRef: authData }, { movieId }],
    });

    // 평점 삭제
    await Star.updateOne(
      { userRef: authData },
      { $pull: { starList: { movieId: movieId } } },
    );

    // 좋아요 삭제
    await Like.deleteOne({
      reviewRef: reviewData,
    });

    res.json({
      result: "리뷰가 삭제되었습니다.",
    });
  }),
);

module.exports = router;
