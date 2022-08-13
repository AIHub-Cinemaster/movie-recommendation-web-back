const { Router } = require("express");
const { User } = require("../models");
const { Review } = require("../models");
const { Star } = require("../models");
const asyncHandler = require("../utils/async-handler");

// UTC to KST
const { moment } = require("../utils/moment");

const router = Router();

/*
* Read.
유저별 리뷰 조회

TODO : 평점 조회 추가
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
      .populate("starRef");

    if (reviewData.length === 0) {
      res.status(404);
      res.json({
        fail: "작성한 리뷰가 존재하지 않습니다.",
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

        const data = {
          movieId: review.movieId,
          author: review.userRef.name,
          title: review.title,
          content: review.content,
          star: star,
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

/*
* Create.
리뷰 작성
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
          starRef: starData,
        });

        res.json({
          result: "리뷰가 작성되었습니다.",
        });
      }
    }
  }),
);

/*
* Update.
리뷰 수정

TODO : 평점 수정 추가
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
