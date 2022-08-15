const { Router } = require("express");
const asyncHandler = require("../utils/async-handler");

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = [
      31, 1029, 1061, 1129, 1172, 1263, 1287, 1293, 1339, 1343, 1371, 1405,
      1953, 2105, 2150, 2193, 2294, 2455, 2968, 3671, 10, 17, 39, 47, 50, 52,
      62, 11, 144,
    ];

    res.json(result);
  }),
);

module.exports = router;
