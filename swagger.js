// swagger.js
const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "ABM Swagger RestFul API UI",
      description: "Node.js RestFul API UI",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./routes/*.js", "./routes/user/*.js", "./routes/board/*.js"], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
