const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/async-handler");
const router = Router();

/*
* 영화 랜덤으로 뽑아오기
movieCounte 갯수만큼 기존 데이터셋 파일(ratings_small.csv) 에 
mmoiveID 중 20개를 추출하여 Client에게 전달한다
*/
router.get(
  "/:movieCount",
  asyncHandler(async (req, res) => {
    /*
    movie Count 만큼 영화 뽑아서 응답
    */
    const { movieNum } = req.params;
    const FILE_NAME = "ratings_small.csv";

    const csvPath = path.join(
      __dirname,
      "..",
      "services",
      "recommend",
      "data",
      FILE_NAME,
    );
    // fs.exists(csvPath, function (exists) {
    //   if (exists) {
    //     res.status(500);
    //     res.json({
    //       fail: `${csvPath} 서버 경로에 파일이 존재하지 않습니다.`,
    //     });
    //     return;
    //   }
    // });

    // csv 파일 읽기
    var data = fs.readFileSync(csvPath, { encoding: "utf8" });
    var rows = data.split("\n");
    const movieSet = new Set();

    // 영화 종류 가져오기 중복 안되게 가져오기
    for (var rowIndex in rows) {
      var row = rows[rowIndex].split(",");

      if (rowIndex === "0") {
        var columns = row;
      } else {
        var data = {}; // 빈 객체를 생성하고 여기에 데이터를 추가한다.

        for (var columnIndex in columns) {
          // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.

          var column = columns[columnIndex];
          data[column] = row[columnIndex];
        }
        // result.push(data.movieId);
        movieSet.add(data.movieId);
      }
    }

    const resultSet = new Set();

    // set에 갯수 movieCount 될 떄까지 랜덤으로 추출
    // set이 중복이 허용 안되므로 넣어도 갯수가 안늘어날 수도 있음
    while (resultSet.size < movieCount) {
      resultSet.add(Math.floor(Math.random() * movieSet.size));
    }

    res.json({
      movieNum: Number(movieCount),
      result: Array.from(resultSet),
    });

    return;
  }),
);

/*
 * Client 에서 평가한 영화 및 평점을 
    CSV 에 저장 한다
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    /*
    IN - 
      "shortId" : "Dw16vazji88ljaxnaCAcp",
      "movieList":[{"a":3.5}, {"b":4.0}]
    OUT -
    [
      {
        userId: 'Dw16vazji88ljaxnaCAcp',
        movieId: 'a',
        rating: 3.5,
        timestamp: 1660561089570
      },
      {
        userId: 'Dw16vazji88ljaxnaCAcp',
        movieId: 'b',
        rating: 4,
        timestamp: 1660561089570
      }
    ]
    */
    const { shortId, movieList } = req.body;

    const FILE_NAME = "ratings_small.csv";
    const csvPath = path.join(
      __dirname,
      "..",
      "services",
      "recommend",
      "data",
      FILE_NAME,
    );

    // Header 설정
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        { id: "userId", title: "USER ID" },
        { id: "movieId", title: "MOVIE ID" },
        { id: "rating", title: "RATING" },
        { id: "timestamp", title: "TIMESTAMP" },
      ],
      append: true,
    });

    const records = [];

    const time = Date.now();

    movieList.map((x) => {
      records.push({
        userId: shortId,
        movieId: Object.keys(x)[0],
        rating: x[Object.keys(x)],
        timestamp: time,
      });
    });

    console.log(records);

    csvWriter
      .writeRecords(records) // returns a promise
      .then(() => {
        console.log("...Done");
      });

    res.json("구현 중....");
  }),
);

module.exports = router;
