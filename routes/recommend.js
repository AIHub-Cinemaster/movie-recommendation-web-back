const { Router } = require("express");
const router = Router();
const asyncHandler = require("./../utils/async-handler");
const { User } = require("../models");
const { Star } = require("../models");

const recommender = require("../services/recommend/recommender");
let recommendList = recommender.recommendList;

/*
- 기능 구현 보류
*/
/*
router.get(
  "list/:email",
  asyncHandler(async (req, res, next) => {
    const { email } = req.params;
    const authData = await User.findOne({ email });

    if (!authData) {
      res.status(401);
      res.json({
        fail: "User not found",
      });
      return;
    }
  }),
);
*/

module.exports = router;
