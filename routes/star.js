const { Router } = require("express");
const { User } = require("../models");
const { Star } = require("../models");
const asyncHandler = require("../utils/async-handler");

const router = Router();

// 별점 가져오기
router.get(
  "/:email/:movieId",
  asyncHandler(async (req, res, next) => {
    const { email, movieId } = req.params;

    const starData = await Star.findOne({ email });
    const result = starData.starList.find((element) => {
      if (element.movieId === movieId) {
        return true;
      }
    });

    if (result) {
      res.json(result);
    } else {
      // 별점 등록한 적 없을 때 처리
      res.json({
        movieId: movieId,
        star: 0,
      });
    }
  }),
);

// 별점 등록 및 수정
router.post(
  "/add",
  asyncHandler(async (req, res, next) => {
    const { email, movieId, star } = req.body;

    const authData = await User.findOne({ email }); //없으면 null
    if (!authData) {
      res.status(500);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }
    
    // Create. 별점 자체를 최초 등록
    const checkStar = await Star.findOne({ userRef: authData }); //없으면 null

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

      res.json({
        data: starList,
        result: "별점 목록에 추가 되었습니다.",
      });

      return;
    }

    // Update. 별점 자체를 등록한 적이 있지만
    // 해당 영화를 별점이 매긴 적이 있는지 없는지로 구분 된다
    const callFindIndex = (element) => {
      return element.movieId == movieId;
    };

    const starList = checkStar.starList;
    const findIndex = starList.findIndex(callFindIndex);
    console.log(findIndex);
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

      res.json({
        data: newStarist,
        result: "별점 목록에 없던 영화라 추가 되었습니다.",
      });

      return;
    } else {
      // 기존에 평점을 매겼던 영화라면
      starList[findIndex].star = star;

      await Star.updateOne(
        { userRef: authData },
        {
          starList,
        },
      );

      res.json({
        data: starList,
        result: "별점 목록에 있던 영화라 수정 되었습니다.",
      });

      return;
    }
  }),
);

module.exports = router;
