// models/User.js
const mongoose = require("mongoose");

// mongoDB에 회원정보를 저장할 스키마를 regionSchema에 정의
const regionSchema = mongoose.Schema({
  region_code: {
    type: String,
    unique: 1,
  },
  region: {
    type: String,
  },
  district: {
    type: String,
  },
});

// 데이터베이스 모델을 정의
const region = mongoose.model("region", regionSchema);

const getRegions = async () => {
  try {
    let regions = await region.find();
    let jsonData = {};
    for (let i = 0; i < regions.length; i++) {
      if (i !== 0) {
        if (!jsonData.hasOwnProperty(regions[i].region)) {
          jsonData[regions[i].region] = [];
        }
        jsonData[regions[i].region].push({
          label: regions[i].district,
          code: regions[i].region_code,
        });
      }
    }
    return jsonData;
  } catch (err) {
    return err;
  }
};

module.exports = {
  region,
  getRegions,
};
