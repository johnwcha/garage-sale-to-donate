const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

module.exports = {
  db,
}
//     auth: {
//         user: 'garagesaletodonate@gmail.com',
//         pass: 'WR72c6@_PM-*r]Gj'
//     }
