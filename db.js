const firebase = require("firebase-admin");

var serviceAccount = require('./file_private_key.json');

// Initialize Firebase
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://abm-firebase-1ac9c-default-rtdb.asia-southeast1.firebasedatabase.app"
}
);

let database = firebase.database();

module.exports = database;