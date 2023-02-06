//express 모듈 불러오기
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io")
const http = require("http");
const Message = require("./model/message");

//express 사용
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const ios = require("socket.io-client");

var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(
  cookieSession({
    name: "ABM-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);
app.use(express.json({ extended: false }));
app.use(cookieParser());
const connectDB = require("./db");

connectDB();

const api = require("./routes/index.js");
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// const { swaggerUi, specs } = require("./swagger.js");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

//socket
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("enter_room", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("welcome", data);
    console.log(socket.rooms); //현재 들어가있는 방을 표시 (기본적으로 User와 Server 사이에 private room이 1개 있음)
  });

  socket.on("welcome", (data) => {
    console.log("welcome socket")
    console.log(data)
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  //socket.emit : 앱에서 기존 메시지를 읽을 수 있도록 서버가 채팅 기록을 불러와야 함. (emit : send의 역할을 함)  
  //socket.on("message" : 내가 앱에서 채팅을 쳤을 때 (on : receive의 역할을 함.)
  socket.on("new_message", async (data) => {
    // data : 각종 정보를 담고 있는 payload object
    // data.room message를 보내는 room의 이름(귓을 위해서는 socket_id를 room으로 사용하면 된다.)
    // data.user message를 보내는 user의 이름
    // data.message message : 메시지의 본문.
    let newMessage = new Message({
      user: data.user,
      message: data.message,
      created: new Date(),
      room_id: data.room,
    });
    await newMessage.save((err) => {
      if (err) console.log(err);
    });
    // Sending the new message to call the connected clients
    console.log("newMessage : ",newMessage)
    io.to(data.room).emit("new_message", newMessage);
  });
});

/*
client test
const socket = ios.connect('ws://localhost:3000', {transports: ['websocket']})
let roomName="1";
let data = {};
data.value = "hello"
socket.on("welcome", (data) => {
  console.log("welcome socket")
  console.log(data)
});

socket.on("bye", () => {
});

socket.emit("new_message", (data) => {
  console.log(`You: ${data.value}`);
});
*/

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
