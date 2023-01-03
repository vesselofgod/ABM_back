//express 모듈 불러오기
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const api = require("./routes/index.js")

//express 사용
const app = express()

var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions))
//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(
  cookieSession({
    name: "ABM-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);
app.use(express.json({ extended: false })); 

const connectDB  = require("./db");

connectDB()

app.use("/api", api)

const { swaggerUi, specs } = require("./swagger.js")

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */
var user = require('./routes/user/index.js');
var register= require('./routes/user/register.js');
var auth = require("./routes/user/auth")
app.use('/user', user);
app.use('/register', register);
app.use("/auth", auth);

app.get("/", (req, res) => {
  //Hello World 데이터 반환
  res.send("Hello World")
})

// http listen port 생성 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});