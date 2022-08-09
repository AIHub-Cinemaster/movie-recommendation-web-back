const { spawn } = require("node:child_process");

// python.exe 경로
const pythonPath =
  "C:\\Users\\1\\AppData\\Local\\Programs\\Python\\Python38\\python.exe";

// 파이썬 스크립트 파일 경로
const scriptPath = "app.py";

let userId = 1;
let movieId = 3030;

const prediction = spawn(`${pythonPath}`, [
  `${scriptPath}`,
  `${userId}`,
  `${movieId}`,
]);

let recommendList = 0;

prediction.stdout.on("data", function (data) {
  console.log(data.toString());
  recommendList = data;
});

exports.recommendList = recommendList;
