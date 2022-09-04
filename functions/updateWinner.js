const functions = require("firebase-functions")
const { db } = require('./admin')

var sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey("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")

function sendEmail(to, biditem) {
    const text = `Your offer of $${biditem.winningamount} for the donation: ${biditem.itemName} has been accepted`
    const html = `<span style="font-size:18px"> Your offer at $${biditem.winningamount} 
        for the donation: ${biditem.itemName} has been accepted. </span><br />
        <img src="${biditem.imagesURL[0]}" />`
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

const accountSid = 'AC169e43b7f69ca1827c8458325fdd4593'
const authToken = '706e49fb1d0f3888735b81c3f07fff12'
const client = require('twilio')(accountSid, authToken)
function sendSMS(number, biditem) {
    const phone = `+1${number}`
    const text = `Your offer of $${biditem.winningamount} for the donation: ${biditem.itemName} has been accepted`
    client.messages.create({
       body: text,
       //from: '+16263166166',
       messagingServiceSid: 'MGe5538b0f85f6a5bd1adcd7e7b7328cf3',
       to: phone
    }).then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}

async function notifyWinner(biditem){
    const doc = await db.collection('users').where('id', '==', biditem.winner).get()
    if (doc.empty) {
        console.log('No matching documents.')
        return
    }
    doc.forEach(item => {
        console.log(item.id, '=>', item.data())
        if (item.data().email != '') 
            sendEmail( item.data().email, biditem)
        if (item.data().phone != '')
            sendSMS( item.data().phone, biditem)
    })
}

// 以上 notifyWinner ---------------
// 以下 notifyAdmin ----------------

function sendAdminEmail(to, newitem) {
    const text = `A new donation item is up for approval: ${newitem.itemName}`
    const html = `<span style="font-size:18px"> 
        A new donation item is up for approval: ${newitem.itemName} </span><br />
        <img src="${newitem.imagesURL[0]}" />`
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

function sendAdminSMS(number, newitem) {
    const phone = `+1${number}`
    const text = `A new donation item is up for approval: ${newitem.itemName}`
    client.messages.create({
       body: text,
       //from: '+16263166166',
       messagingServiceSid: 'MGe5538b0f85f6a5bd1adcd7e7b7328cf3',
       to: phone
    }).then((message) => console.log(message.sid))
    .catch((err) => console.log(err))
}

async function notifyAdmin(newItem){
    const doc = await db.collection('users').where('membership', '==', 'admin').get()
    if (doc.empty) {
        console.log('No matching documents.')
        return
    }
    doc.forEach(item => {
        console.log(item.id, '=>', item.data())
        if (item.data().email != '') { 
            sendAdminEmail( item.data().email, newItem)
        }
        if (item.data().phone != '') { 
            sendAdminSMS( item.data().phone, newItem)
        }
    })
}

exports.updateWinner = functions.firestore
  .document('items/{winner}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data()
    // ...or the previous value before this update
    const previousValue = change.before.data()
    console.log('before update', previousValue.winner)
    // access a particular field as you would any JS property
    const winner = newValue.winner
    console.log('after update', winner)

    // notify when someone made an offer
    // notify when someone awarded a bid

    if (previousValue.winner === undefined) {
        if (winner === undefined) {
            console.log('NOT winner field, OTHER fields updated -----------------')
            //notifyAdmin(newValue)
        } else if (winner.indexOf('_') != -1) {
            console.log('-------------------------------------')
            console.log('purchase made, email buyer and seller')
            console.log(newValue)
            //notifyWinner(newValue)    
        }
    } 
    if (previousValue.status === '0' && newValue.status === '1') {
        console.log('item content approved --------------------')
    }

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

