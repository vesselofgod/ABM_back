// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// mongoDB에 회원정보를 저장할 스키마를 userSchema에 정의
const userSchema = mongoose.Schema({
  uid: {
    type: String,
    trim: true, // 공백을 없애주는 역할
    unique: 1, // 똑같은 이메일을 쓰지 못하도록
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  sex: {
    type: String,
  },
  birth: {
    type: Date,
  },
  email: {
    type: String,
    trim: true, // 공백을 없애주는 역할
    required: true,
  },
  profileImg: {
    type: String,
  },
  nickname: {
    type: String,
    unique: 1
  },
  description: {
    type: String,
    minlength: 10,
  },
  interest_region: {
    type: Array,
  },
  interest_hobby: {
    type: Array,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else next();
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  const user = this;

  const token = jwt.sign(user._id.toHexString(), process.env.JWT_SECRET_KEY);

  user.token = token;
  console.log(user.token);

  user.save(function (err, user) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  const user = this;
  jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      callback(null, user);
    });
  });
};

// 데이터베이스 모델을 정의
const User = mongoose.model("User", userSchema);

module.exports = User;
