// models/User.js
const mongoose = require('mongoose')

// mongoDB에 회원정보를 저장할 스키마를 userSchema에 정의
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        trim: true,  // 공백을 없애주는 역할
        unique: 1,  // 똑같은 이메일을 쓰지 못하도록
        required: true,
    },
    password: {
        type: String,
        minlength: 5,
        required: true,
    },
})

// 데이터베이스 모델을 정의
const User = mongoose.model('User', userSchema)

module.exports = User