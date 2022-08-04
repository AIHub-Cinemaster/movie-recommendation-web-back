const { Router } = require("express");
const { User } = require("./../models");
const { StarRating } = require("./../models");
const asyncHandler = require("./../utils/async-handler");

const router = Router();

// 별점 가져오기
router.get(
  "/:movieId",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { movieId } = req.params;

    const starData = await StarRating.findOne({ email });
    const result = starData.starList.find((element) => {
      if (element.movieId === movieId) {
        return true;
      }
    });

    // 별점 등록한 적 없을 때 처리
    if (result) {
      res.json(result);
    } else {
      res.json({
        movieId: movieId,
        star: 0,
      });
    }
  }),
);

// 별점 등록
router.post(
  "/:movieId",
  asyncHandler(async (req, res, next) => {
    const { email, star } = req.body;
    const { movieId } = req.params;

    const userStarData = await User.findOne({ email }).populate("starId");

    const starRatingList = userStarData.starId.starList;
    const newStarRatingList = [
      ...starRatingList,
      {
        movieId: movieId,
        star,
      },
    ];
    console.log(newStarRatingList);

    await StarRating.updateOne(
      { email },
      {
        starList: newStarRatingList,
      },
    );

    res.json({
      result: " 별점 목록에 추가 되었습니다.",
    });
  }),
);

// 별점 수정
router.post(
  "/:movieId/update",
  asyncHandler(async (req, res, next) => {
    const { email, star } = req.body;
    const { movieId } = req.params;

    const starData = await StarRating.findOne({ email });
    if (!starData) {
      res.status(401);
      res.json({
        fail: "존재하지 않는 이메일입니다.",
      });
      return;
    }
    const starRatingList = starData.starList;
    const callFindIndex = (element) => {
      return element.movieId == movieId;
    };
    const findIndex = starRatingList.findIndex(callFindIndex);

    if (findIndex === -1) {
      res.status(500);
      res.json({
        fail: "해당 영화의 기등록된 별점을 찾지 못했습니다. 별점을 새로 등록해주세요.",
      });
      return;
    }
    starRatingList[findIndex].star = star;

    await StarRating.updateOne(
      { email },
      {
        starList: starRatingList,
      },
    );

    res.json({
      result: " 별점 목록에 추가 되었습니다.",
    });
  }),
);

module.exports = router;
