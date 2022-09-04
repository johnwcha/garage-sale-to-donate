import { db } from '../plugins/firebase.js'

export const state = () => ({
  uid: '',
  userObj: null,
  registered: false,
  membership: 'user',
  avatar_site: 'https://speak.usc.edu/206/duoting/assets/',
  avatar: '',
  code: '',
  email: '',
  owner_id: '',
  churches: [],
  alias: [],
  offerlist: [],
  itemDetails: null,
  waitlist: [],
  waitlistCount: 0,
  backtoViewlist: false,
  editItem: null,
  winningbids: [],
  winningbidsCount: 0,
  _animals: ['alligator.png', 'ant.png', 'bat.png', 'bear.png', 'bee.png', 'bird.png', 'bull.png', 'bulldog.png', 'butterfly.png', 'cat.png', 'chicken.png', 'cow.png', 'crab.png', 'crocodile.png', 'deer.png', 'dog.png', 'donkey.png', 'duck.png', 'eagle.png', 'elephant.png', 'fish.png', 'fox.png', 'frog.png', 'giraffe.png', 'gorilla.png', 'hippo.png', 'horse.png', 'insect.png', 'lion.png', 'monkey.png', 'moose.png', 'mouse.png', 'owl.png', 'penguin.png', 'pig.png', 'rabbit.png', 'rhino.png', 'rooster.png', 'shark.png', 'sheep.png', 'tiger.png', 'turkey.png', 'turtle.png',
    'wolf.png'
  ]
})

export const mutations = {
  SET_USER (state, uid) {
    state.uid = uid
    // console.log(uid)
  },
  SET_REGISTERED (state, registered) {
    state.registered = registered
  },
  SET_CHURCHES (state, churches) {
    state.churches = churches
  },
  SET_OWNER (state, owner) {
    state.avatar = owner.avatar
    state.code = owner.code
    state.owner_id = owner.owner_id
  },
  SET_ITEMDETAILS (state, details) {
    //console.log(details)
    state.itemDetails = details
  },
  SET_BACKTOVIEWLIST (state, status) {
    state.backtoViewlist = status
  },
  UPDATE_ITEM (state, editItem) {
    state.editItem = editItem
  },
  SET_ALIAS (state, alias) {
    //console.log(alias)
    state.alias = alias
  },
  SET_MEMBERSHIP (state) {
    state.membership = 'admin'
  },
  SET_WAITLIST (state, waitlist) {
    state.waitlist = waitlist
    state.waitlistCount = waitlist.length
  },
  SET_WINNINGBIDS (state, winningbids) {
    state.winningbids = winningbids
    state.winningbidsCount = winningbids.length
  },
  SET_USEROBJ (state, userObj) {
    state.userObj = userObj
    state.avatar = userObj.avatar
    state.owner_id = userObj.id
    //console.log(userObj)
  }
}

export const actions = {
  setUser ({ commit }, uid) {
    commit('SET_USER', uid)
  },
  setRegistered ({commit}, registered) {
    commit('SET_REGISTERED', registered)
    if (registered) {
      // check if 'email'
      const id = localStorage.gasdon_id
      db.collection('users').where('id', '==', id).get().then(doc =>{
        //console.log(doc)
        if (doc.size>1) {
          console.log('Problem: duplicate account! Contact admin.')
        } else {
          //console.log(doc.docs[0].data().email)
          const email = doc.docs[0].data().email
          if (email=='') {
            db.collection('users').where('id', '==', id).get().then(docs =>{
              let alias = []
              docs.forEach(item => {
                alias.push(item.data().id)
              })
              commit('SET_ALIAS', alias)
            }).catch(e => { alert(e.message)})
          } else {
            db.collection('users').where('email', '==', email).get().then(docs =>{
              let alias = []
              docs.forEach(item => {
                alias.push(item.data().id)
              })
              commit('SET_ALIAS', alias)
            }).catch(e => { alert(e.message)})
          }
        }
      }).catch(err => { alert(err.message) } )
    }
  },
  setChurches ({commit}, churches) {
    commit('SET_CHURCHES', churches)
  },
  setOwner ({commit}, owner) {
    commit('SET_OWNER', owner)
  },
  setDetails ({commit}, details) {
    commit('SET_ITEMDETAILS', details)
  },
  setBacktoList ({commit}, status) {
    commit('SET_BACKTOVIEWLIST', status)
  },
  removeAllBackButtons ({commit}) {
    commit('SET_BACKTOVIEWLIST', false)
  },
  updateItem({commit}, item) {
    commit('UPDATE_ITEM', item)
  },
  getChurches({commit}) {
    db.collection('churches').orderBy('city').get().then((docs) => {
      //console.log(docs)
      let churches = []
      docs.forEach(doc =>
        churches.push({ id: doc.id , ...doc.data()})
      )
      commit('SET_CHURCHES', churches)
      //console.log(churches)
    })
  },
  setMembership({commit}, userObj) {
    commit('SET_MEMBERSHIP', userObj)
  },
  setWaitlist({commit}, waitlist) {
    commit('SET_WAITLIST', waitlist)
  },
  setWinningBids({commit}, obj) {
    commit('SET_WINNINGBIDS', obj)
  },
  setUserObj({commit}, userObj) {
    commit('SET_USEROBJ', userObj)
  }
}

// This error usually occurs if you're watching the passed in value somewhere
// which causes an infinite update loop but if you're not watching, it could be
// due to you passing in the original value rather than a copy.

// IINDEX page
// check if registered
// yes: show app icon
// no : direct to ACCOUNT page