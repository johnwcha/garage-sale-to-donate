import firebase from 'firebase'
import 'firebase/firestore' // if use firestore
import 'firebase/storage'
import 'firebase/auth'
//import 'firebase/functions'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDeWXMPwC35qOdSIZEKLUrp6pa-ixZM2-M',
    authDomain: 'garage-sale-to-donate.firebaseapp.com',
    projectId: 'garage-sale-to-donate',
    storageBucket: 'garage-sale-to-donate.appspot.com',
    messagingSenderId: '1007571544697',
    appId: '1:1007571544697:web:b9eade3523a0a2925142a8',
    measurementId: 'G-VPX4ZP1SM0'
  })
}

//firebase.firestore().settings({ timestampsInSnapshots: true })
firebase.firestore().settings({ ssl: false, host: 'localhost:8080', timestampsInSnapshots: true })
// data persist
// firebase emulators:start --import=./db_data --export-on-exit

const db = firebase.firestore() // for production
const storage = firebase.storage() // if use storage
const auth = firebase.auth()

export { storage, db, auth }

// denormailize data sets
// const taskCategory = {}
// snapshots.forEach(snap => {
//   const task = snap.val()
//   const { category } = task
//   if (taskCategory[category] == null) {
//     taskCategory[category] = {}
//   }
//   taskCategory[category][snap.key] = task
// })
