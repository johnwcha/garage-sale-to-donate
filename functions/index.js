const functions = require('firebase-functions');

const newItemUpload = require('./newItemUpload')
const newOffer = require('./newOffer')
const updateWinner = require('./updateWinner')

exports.newItemUpload = newItemUpload.newItemUpload
exports.newOffer = newOffer.newOffer
exports.updateWinner = updateWinner.updateWinner



//     auth: {
//         user: 'garagesaletodonate@gmail.com',
//         pass: 'WR72c6@_PM-*r]Gj'
//     }
