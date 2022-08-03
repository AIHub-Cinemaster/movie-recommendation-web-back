const { Router } = require("express");
const { User } = require("./../models");
const { StarRating } = require("./../models");
const asyncHandler = require("./../utils/async-handler");

const router = Router();

// 별점 가져오기
router.get(
  "/:movieApiId",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const movieData = await MovieCart.findOne({ email });

    if (email && movieData.movieList) {
      res.json(movieData.movieList);
    } else {
      res.status(500);
      res.json({
        fail: "찜 목록 조회에 실패했습니다.",
      });
    }
  }),
);

// 영화 찜 등록
router.post(
  "/add",
  asyncHandler(async (req, res, next) => {
    const { email, movieId } = req.body;

    // User 컬렉션에서 emailId를 찾은 후
    // populate를 이용해서 cart 컬렉션으로 참조
    // cart 컬렉션에 movieList를 가져와서
    // 기존 리스트에서 새로들어온 movieId 추가
    const authData = await User.findOne({ email }).populate("cartId");
    const cartMovieList = authData.cartId.movieList;

    const newCartMovieList = [...cartMovieList, movieId];
    console.log(newCartMovieList);

    await MovieCart.updateOne(
      { email },
      {
        movieList: newCartMovieList,
      },
    );

    res.json({
      result: "찜 목록에 추가 되었습니다.",
    });
  }),
);

// 영화 찜 삭제
router.get(
  "/delete",
  asyncHandler(async (req, res, next) => {
    const { email, movieId } = req.body;
    const movieData = await MovieCart.findOne({ email });
    // await MovieCart.deleteOne({ email });
    const movieList = movieData.movieList;
    const idx = movieList.indexOf(movieId);

    // 유효성 검사
    // 요청한 movieId 가 DB에 있는 MovieList에 포함 되어 있지 않은 경우
    if (idx < 0) {
      res.status(401);
      res.json({
        fail: "찜 목록에 해당 영화가 없습니다.",
      });
      return;
    }

    movieList.remove(movieId);
    await MovieCart.updateOne(
      { email },
      {
        movieList,
      },
    );

    res.json(movieList);
  }),
);

module.exports = router;
