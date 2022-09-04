const functions = require("firebase-functions")
const { db } = require('./admin')

var sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey("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")

function sendEmail(to, newitem) {
    const text = `${newitem.itemName} a new donation item is up for approval`
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
        console.log('Email sent -----------------------------------')
    }).catch((error) => {
        console.error(error.message)
    })
}

const accountSid = 'AC169e43b7f69ca1827c8458325fdd4593'
const authToken = '706e49fb1d0f3888735b81c3f07fff12'
const client = require('twilio')(accountSid, authToken)
function sendSMS(number, newitem) {
    const phone = `+1${number}`
    const text = `${newitem.itemName}: a new donation item is up for approval`
    client.messages.create({
       body: text,
       //from: '+16263166166',
       messagingServiceSid: 'MGe5538b0f85f6a5bd1adcd7e7b7328cf3',
       to: phone
    }).then((message) => {
        console.log(message.sid)
        console.log('SMS sent -----------------------------------')
    }).catch((err) => console.log(err))
}

async function notifyAdmin(newItem){
    const doc = await db.collection('users').where('membership', '==', 'admin').get()
    if (doc.empty) {
        console.log('No Admin found in db --------------------.')
        return
    }
    doc.forEach(item => {
        console.log(item.id, '=>', item.data())
        if (item.data().email != '') { 
            //sendEmail( item.data().email, newItem)
            console.log('notifyAdmin ----------- send email -------------')
        }
        if (item.data().phone != '') { 
            //sendSMS( item.data().phone, newItem)
            console.log('notifyAdmin ----------- send text -------------')
        }
    })
}

exports.newItemUpload = functions.firestore
  .document('items/{winner}')
  .onCreate((change, context) => {
    const newValue = change.data()
    // notify when new upload
    notifyAdmin(newValue)
})
