var admin = require("firebase-admin");

var serviceAccount = require("./ServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://taskmanager-mean-default-rtdb.firebaseio.com/"
});

module.exports = admin;