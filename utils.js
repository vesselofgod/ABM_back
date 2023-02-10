const jwt = require("jsonwebtoken");
const admin = require("./config/notice.config");

function parseJWTPayload(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) throw err;
    return decoded;
  });
}

async function sendNotice(device_tokens, notice) {
  if (device_tokens.length == 0) {
    return false;
  } else if (device_tokens.length == 1) {
    let message = {
      data: {
        title: notice.title,
        body: notice.body,
        link: notice.link,
        type: notice.type,
      },
      token: device_tokens[0].device_token,
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
        return false;
      });
    return true;
  } else {
    const token_list = [];
    for (let i = 0; i < device_tokens.length; i++)
      token_list.push(device_tokens[i].device_token);
    let message = {
      notification: {
        title: notice.title,
        body: notice.body,
      },
      data: {
        link: notice.link,
        type: notice.type,
      },
      tokens: token_list,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(registrationTokens[idx]);
            }
          });
          console.log("List of tokens that caused failures: " + failedTokens);
          return false;
        }
      });
    return true;
  }
}

module.exports = {
  parseJWTPayload,
  sendNotice,
};
