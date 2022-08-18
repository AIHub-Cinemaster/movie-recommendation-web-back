const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/async-handler");
const router = Router();
const { EvalStar } = require("../models");
const { User } = require("../models");
// const parse = require("csv-parse/lib/sync");
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
    const { movieCount } = req.params;
    console.log(movieCount);
    const FILE_NAME = "rating_tmdb_link.csv";

    const csvPath = path.join(
      __dirname,
      "..",
      "services",
      "recommend",
      "data",
      FILE_NAME,
    );
    fs.exists(csvPath, function (exists) {
      if (exists) {
        res.status(500);
        res.json({
          fail: `${csvPath} 서버 경로에 파일이 존재하지 않습니다.`,
        });
        return;
      }
    });

    // const movieSet = new Set();
    // const csvFile = fs.readFileSync(csvPath);
    // // console.log(csvFile.toString());
    // //parse 메서드 -> 2차원배열화
    // const records = parse(csvFile.toString());
    // console.log(records);
    // fs.createReadStream(csvPath)
    //   .pipe(csv())
    //   .on("data", function (data) {
    //     try {
    //       movieSet.add(data.tmdbId);
    //       //perform the operation
    //     } catch (err) {
    //       //error handler
    //     }
    //   })
    //   .on("end", function () {
    //     console.log("end", movieSet);
    //   });

    // const resultSet = new Set();
    // while (resultSet.size < movieCount) {
    //   resultSet.add(Math.floor(Math.random() * movieSet.size));
    // }

    /////////////////////////
    // // csv 파일 읽기
    // var data = fs.readFileSync(csvPath, { encoding: "utf8" });
    // var rows = data.split("\n");

    // const movieSet = new Set();

    // // 영화 종류 가져오기 중복 안되게 가져오기
    // for (var rowIndex in rows) {
    //   var row = rows[rowIndex].split(",");

    //   if (rowIndex === "0") {
    //     var columns = row;
    //   } else {
    //     var data = {}; // 빈 객체를 생성하고 여기에 데이터를 추가한다.

    //     for (var columnIndex in columns) {
    //       // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.

    //       var column = columns[columnIndex];
    //       console.log("column", column);
    //       data[column] = row[columnIndex];
    //       console.log("data[column]", data[column]);
    //     }
    //     // result.push(data.movieId);
    //     movieSet.add(data.movieId);
    //   }
    // }
    // console.log(movieSet);
    // const resultSet = new Set();

    // // set에 갯수 movieCount 될 떄까지 랜덤으로 추출
    // // set이 중복이 허용 안되므로 넣어도 갯수가 안늘어날 수도 있음
    // while (resultSet.size < movieCount) {
    //   resultSet.add(Math.floor(Math.random() * movieSet.size));
    // }

    res.json({
      movieNum: Number(movieCount),
      result: [37550, 862, 3525, 22256, 22796],
      // result: [37550],
      // result: Array.from(resultSet),
    });

    return;
  }),
);

////////////////////////////////////////////////////////////////////

/*
 * Client 에서 평가한 영화 및 평점을 
    CSV 에 저장 한다
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    /*
    IN - 
[
  { movieId: '37550', rating: 2 },
  { movieId: '862', rating: 3.5 },
  { movieId: '3525', rating: 0.5 },
  { movieId: '22256', rating: 0 },
  { movieId: '22796', rating: 1 }
]
    
    */
    const { shortId, movieList } = req.body;
    console.log(shortId, movieList);
    const FILE_NAME = "rating_tmdb_link.csv";
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
        { id: "tmdbId", title: "TMDB ID" },
        { id: "rating", title: "RATING" },
      ],
      append: true,
    });

    const records = [];

    movieList.map((x) => {
      console.log(Object.keys(x));
      records.push({
        userId: shortId,
        tmdbId: x[Object.keys(x)[0]],
        rating: x[Object.keys(x)[1]],
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

/*
 * 영화 별점 한개씩 디비에 쓰려고 만들어 놓은 코드
 */

// /*
//  * Evalutaion 영화 별점 추가 (1개씩)
//   movieStar = {
//     movieId : "1234",
//     star : 4.5
//   }
//  */
//   router.post(
//     "/each",
//     asyncHandler(async (req, res) => {
//       const { shortId, movieId, star } = req.body;

//       const authData = await User.findOne({ shortId }); //없으면 null
//       if (!authData) {
//         res.status(401);
//         res.json({
//           fail: "User DB 에서 유저 정보를 찾을 수 없습니다.",
//         });
//         return;
//       }
//       console.log("authData", authData);

//       // Create. 별점 자체를 최초 등록
//       const checkEvalStar = await EvalStar.findOne({ userRef: authData }); //없으면 null
//       console.log("checkEvalStar -- ", checkEvalStar);
//       if (!checkEvalStar) {
//         await EvalStar.create({
//           userRef: authData,
//           starList: [{ movieId, star }],
//         });

//         res.json({
//           data: [{ movieId, star }],
//           result: "평가 별점 목록에 추가 되었습니다.",
//         });

//         return;
//       }

//       // Update. 별점 자체를 등록한 적이 있지만
//       // 해당 영화를 별점이 매긴 적이 있는지 없는지로 구분 된다
//       const callFindIndex = (element) => {
//         return element.movieId == movieId;
//       };

//       const evalStarList = checkEvalStar.starList;
//       const findIndex = evalStarList.findIndex(callFindIndex);
//       console.log("findIndex", findIndex);
//       if (findIndex < 0) {
//         // 기존에 평점을 매겼던 적 없는 영화라면
//         const newEvalStarlist = [
//           ...evalStarList,
//           {
//             movieId,
//             star,
//           },
//         ];

//         await EvalStar.updateOne(
//           { userRef: authData },
//           {
//             starList: newEvalStarlist,
//           },
//         );

//         res.json({
//           data: newEvalStarlist,
//           result: "별점 목록에 없던 영화라 추가 되었습니다.",
//         });

//         return;
//       } else {
//         // 기존에 평점을 매겼던 영화라면
//         evalStarList[findIndex].star = star;

//         await EvalStar.updateOne(
//           { userRef: authData },
//           {
//             evalStarList,
//           },
//         );

//         res.json({
//           data: evalStarList,
//           result: "별점 목록에 있던 영화라 수정 되었습니다.",
//         });

//         return;
//       }
//     }),
//   );

//   /*
//    * 평가하다가 중간에 취소 할 경우
//    * Document 삭제
//    */
//   router.get(
//     "/cancel/:shortId",
//     asyncHandler(async (req, res) => {
//       const { shortId } = req.params;
//       const authData = await User.findOne({ shortId });
//       const evalStarDel = await EvalStar.deleteOne({ userRef: authData });

//       if (!evalStarDel) {
//         return res.status(404).json({
//           success: false,
//           data: "User DB 에서 유저 정보를 찾을 수 없습니다.",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: {},
//       });
//     }),
//   );

//   /*
//    * 평가완료 후 제출
//    */
//   router.get(
//     "/submit/:shortId",
//     asyncHandler(async (req, res) => {
//       const { shortId } = req.params;

//       const authData = await User.findOne({ shortId }); //없으면 null

//       if (!authData) {
//         res.status(401);
//         res.json({
//           success: false,
//           data: "User DB 에서 유저 정보를 찾을 수 없습니다.",
//         });
//         return;
//       }

//       // 별점 등록 한적이 없을 때 처리
//       // evalstar Collection 에 해당 유저의 Document가 없을 때
//       const checkEvalStar = await EvalStar.findOne({ userRef: authData }); //없으면 null
//       if (!checkEvalStar) {
//         res.status(500);
//         res.json({
//           success: false,
//           data: "평가 별점을 매기지 않았습니다.",
//         });

//         return;
//       }

//       const evarStarList = checkEvalStar.starList;
//       if (evarStarList.length === 0) {
//         res.status(500);
//         res.json({
//           success: false,
//           data: "평가 별점 배열이 비어 있습니다.",
//         });

//         return;
//       }

//       /*
//        * 모든 유효성 통과
//        */
//       const FILE_NAME = "rating_tmdb_link.csv";
//       const csvPath = path.join(
//         __dirname,
//         "..",
//         "services",
//         "recommend",
//         "data",
//         FILE_NAME,
//       );

//       // Header 설정
//       // userId,tmdbId,rating
//       const createCsvWriter = require("csv-writer").createObjectCsvWriter;
//       const csvWriter = createCsvWriter({
//         path: csvPath,
//         header: [
//           { id: "userId", title: "USER ID" },
//           { id: "tmdbId", title: "TMDB MOVIE ID" },
//           { id: "rating", title: "RATING" },
//         ],
//         append: true,
//       });

//       const records = [];
//       evarStarList.map((x) => {
//         records.push({
//           userId: shortId,
//           tmdbId: x.movieId,
//           rating: x.star,
//         });
//       });

//       console.log(records);

//       csvWriter
//         .writeRecords(records) // returns a promise
//         .then(() => {
//           console.log("...Done");
//         });

//       // const evalStarDel = await EvalStar.deleteOne({ userRef: authData });
//       res.json("구현 중....");
//     }),
//   );

module.exports = router;
