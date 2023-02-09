//express 모듈 불러오기
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const v4 = require("uuid").v4;
const Message = require("./model/message");
const Room = require("./model/room");
const Notice = require("./model/notice");
const Device = require("./model/device");
const User = require("./model/user").User;
const utils = require("./utils.js");
//express 사용
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const ioc = require("socket.io-client");

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
function countRoom(roomName) {
  // 방에 사람이 몇명이 있는지 계산하는 함수(set의 size를 이용)
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  //토큰 받기
  console.log("user connected");
  // data : 각종 정보를 담고 있는 payload object
  // data.room message를 보내는 room의 이름 (귓을 위해서는 socket_id를 room으로 사용하면 된다.)
  // data.token message를 보내는 user의 token
  // data.message message : 메시지의 본문.
  socket.on("join_room", async (data) => {
    const token = data.token.split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let uid = user_data.user.uid;
    let user = await User.findOne({ uid: uid });
    let room_id = data.room;

    if (data.room == undefined || countRoom(data.room) == 0) {
      //방이 처음 만들어짐.
      //피드와 연결해서 초기 톡방 설정 구현
      //톡방 title과 썸네일의 경우 생성 페이지에서 받아와야함.
      let newRoom = new Room({
        room_id: v4(), //uuid v4를 이용해서 random unique id 얻어냄.
        title: data.title,
        fid: data.fid,
        thumbnail: data.thumbnail,
        admin: user,
      });
      newRoom.users.push({
        uid: uid,
        nickname: user_data.user.nickname,
        profileImg: user_data.user.profileImg,
      });

      await newRoom.save((err) => {
        if (err) {
          console.log(err);
        }
      });

      room_id = newRoom.room_id;
    } else {
      // user를 room에 push하면 된다.
      let room = await Room.findOne({ room_id: room_id });
      let find_user = await Room.findOne({
        users: { $elemMatch: { uid: uid } },
        room_id: room_id,
      });
      console.log(find_user);
      if (find_user == undefined) {
        room.users.push({
          uid: uid,
          nickname: user_data.user.nickname,
          profileImg: user_data.user.profileImg,
        });
        room.save();
      }
    }
    socket.join(room_id);
    socket.to(room_id).emit("welcome", data);
    //현재 들어가있는 방을 표시 (기본적으로 User와 Server 사이에 private room이 1개 있음)
    console.log(socket.rooms);
  });

  socket.on("leave_room", async (data) => {
    //TODO : 삭제가 되지 않는 오류 수정
    const token = data.token.split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    await Room.updateAll(
      { room_id: data.room },
      { $pullAll: { users: { uid: user_data.user.uid } } }
    );
    socket.to(data.room).emit("bye", data);
    socket.leave(data.room);
    console.log(socket.rooms);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  //socket.emit : 앱에서 기존 메시지를 읽을 수 있도록 서버가 채팅 기록을 불러와야 함. (emit : send의 역할을 함)
  //socket.on("message" : 내가 앱에서 채팅을 쳤을 때 (on : receive의 역할을 함.)
  socket.on("new_message", async (data) => {
    const token = data.token.split(" ")[1];
    const user_data = utils.parseJWTPayload(token);
    let newMessage = new Message({
      user: user_data.user.nickname,
      message: data.message,
      created: new Date(),
      room_id: data.room,
    });
    await newMessage.save((err) => {
      if (err) console.log(err);
    });
    // Sending the new message to call the connected clients
    console.log("newMessage : ", newMessage);
    io.to(data.room).emit("new_message", newMessage);
    //TODO: room에 있는 모든 유저들에게 notice를 발송해야 함.
    //room에 있는 유저들의 목록을 얻은 다음에 for문을 돌려가면서 notice를 만들고,
    let room = await Room.findOne({ room_id: data.room });
    console.log(room.users.length);
    for (let i = 0; i < room.users.length; i++) {
      let notice = new Notice({
        user: room.users[i].nickname,
        title: room.title,
        body: data.message,
        link: data.room,
        type: "chat",
      });
      let device_tokens = await Device.find({ uid: room.users[i].uid });
      await utils.sendNotice(device_tokens, notice);
    }
  });
});

/*
클라이언트 이벤트
socket.on("welcome", (data) => {
  유저가 톡방을 들어왔을 때
});
socket.on("bye", (data) => {
  유저가 톡방을 나갔을 때
});

});
*/

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
