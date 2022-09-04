const functions = require("firebase-functions")
const { db } = require('./admin')

var sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey("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")

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'AC169e43b7f69ca1827c8458325fdd4593'
const authToken = '706e49fb1d0f3888735b81c3f07fff12'
const client = require('twilio')(accountSid, authToken)

function sendSMS(number, offer) {
    const phone = `+1${number}`
    const text = `Someone offered $${offer.amount} for your donation: ${offer.itemName}`
    client.messages.create({
       body: text,
       //from: '+16263166166',
       messagingServiceSid: 'MGe5538b0f85f6a5bd1adcd7e7b7328cf3',
       to: phone
    }).then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}
// Validate E164 format
// if ( !validE164(phoneNumber) ) {
// }
// function validE164(num) {
//     return /^\+?[1-9]\d{1,14}$/.test(num)
// }

function sendEmail(to, offer) {
    const text = `Someone offered $${offer.amount} for your donation: ${offer.itemName}`
    const html = `<span style="font-size:18px"> Someone offered $${offer.amount} 
        for your donation: ${offer.itemName} </span>`
    const msg = {
        to: to, // Change to your recipient
        from: 'garagesaletodonate@gmail.com', // Change to your verified sender
        subject: text,
        text: text,
        html: html,
    }
    sendgrid.send(msg).then(() => {
        console.log('Email sent')
    }).catch((error) => {
        console.error(error.message)
    })
}

async function notifyOwner(offer){
    const doc = await db.collection('users').where('id', '==', offer.item_owner).get()
    if (doc.empty) {
        console.log('No matching documents.')
        return
    }
    doc.forEach(item => {
        console.log(item.id, '=>', item.data())
        if (item.data().email != '')
            sendEmail( item.data().email, offer)
        if (item.data().phone != '')
            sendSMS( item.data().phone, offer)
    })
}

exports.newOffer = functions.firestore
  .document('offers/{offer}')
  .onCreate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.data()

    // notify when someone made an offer
    console.log('someone made an offer -------------------------------')
    // notifyOwner(newValue)
})

/**
* Here we're using Gmail to send 
* https://us-central1-garage-sale-to-donate.cloudfunctions.net/sendMail
* https://us-central1-garage-sale-to-donate.cloudfunctions.net/sendMail
*/

// Blocked by Google: less secured app
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'garagesaletodonate@gmail.com',
//         pass: 'WR72c6@_PM-*r]Gj'
//     }
// })

// exports.sendMail = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {
      
//         // getting dest email by query string
//         //const dest = req.query.dest

//         const mailOptions = {
//             from: 'GarageSale ToDonate <garagesaletodonate@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
//             to: 'johnwcha@gmail.com',
//             subject: 'GarageSale ToDonate Update', // email subject
//             html: `<p style="font-size: 16px;">Item status update</p>
//                 <br />
//             ` // email content in HTML
//         }
  
//         // returning result
//         return transporter.sendMail(mailOptions, (erro, info) => {
//             if(erro){
//                 return res.send(erro.toString())
//             }
//             return res.send('Sended')
//         })
//     })
// })

