const { Router } = require("express");
const { User } = require("../models");
const { Cart } = require("../models");
const asyncHandler = require("../utils/async-handler");

const router = Router();

// 영화 찜목록 가져오기
router.get(
  "/list/:shortId",
  asyncHandler(async (req, res, next) => {
    const { shortId } = req.params;
    const authData = await User.findOne({ shortId }); //없으면 null

    if (!authData) {
      res.status(500);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const checkCart = await Cart.findOne({ userRef: authData }); //없으면 null
    if (!checkCart) {
      res.json({
        empty: true,
        result: "찜 목록에 등록한 적이 없습니다.",
      });
      return;
    }

    const cartList = checkCart.movieList;
    if (cartList.length) {
      res.json({
        empty: false,
        result: cartList,
      });
    } else {
      res.json({
        empty: true,
        result: "찜 목록이 비어 있습니다.",
      });
    }
  }),
);

// 영화 찜 등록
router.post(
  "/add",
  asyncHandler(async (req, res, next) => {
    const { shortId, movieId } = req.body;

    const authData = await User.findOne({ shortId }); //없으면 null
    if (!authData) {
      res.status(500);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const checkCart = await Cart.findOne({ userRef: authData }); //없으면 null
    console.log("checkCart--", checkCart);
    if (!checkCart) {
      await Cart.create({
        userRef: authData,
        movieList: [movieId],
      });

      res.json({
        result: "찜 목록에 추가 되었습니다.",
      });

      return;
    }

    const cartList = checkCart.movieList;
    console.log("cartList--", cartList);
    if (cartList.indexOf(movieId) !== -1) {
      res.status(401);
      res.json({
        fail: "이미 찜 목록에 등록되어 있는 영화 입니다.",
      });
      return;
    }

    const newCartList = [...cartList, movieId];
    await Cart.updateOne(
      { userRef: authData },
      {
        movieList: newCartList,
      },
    );

    res.json({
      result: "찜 목록에 추가 되었습니다.",
    });
  }),
);

// 영화 찜 삭제
router.post(
  "/delete",
  asyncHandler(async (req, res, next) => {
    const { shortId, movieId } = req.body;
    const authData = await User.findOne({ shortId }); //없으면 null
    if (!authData) {
      res.status(500);
      res.json({
        fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const checkCart = await Cart.findOne({ userRef: authData }); //없으면 null

    if (!checkCart) {
      res.status(500);
      res.json({
        fail: "Cart DB 에 일치하는 유저 정보가 없습니다",
      });
      return;
    }

    const cartList = checkCart.movieList;

    const idx = cartList.indexOf(movieId); // 리스트에 movieId 없으면 -1 반환
    if (idx < 0) {
      res.status(401);
      res.json({
        fail: "해당 영화가 장바구니에 포함되어 있지 않습니다",
      });
      return;
    } else {
      const newCartList = cartList.filter((element) => element != movieId);

      await Cart.updateOne(
        { userRef: authData },
        {
          movieList: newCartList,
        },
      );

      res.json({
        data: newCartList,
        result: "찜 목록에서 삭제가 완료되었습니다.",
      });
      return;
    }
  }),
);

module.exports = router;
