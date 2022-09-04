<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <!-- <logo /> -->
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          構想 2
        </v-card-title>
          <hr>
        <v-card-text>
          <p> <span class="subtitle-1 pink--text"> * Project goal - to build a platform for local saints: </span> <br />
            <span class="ml-3"> 1) to donate your unwanted or unused household items </span> <br />
            <span class="ml-3"> 2) donated items go online for bids </span> <br />
            <span class="ml-3"> 3) generated revenue: 60%-purpose you specify | 10%-建堂基金 | 20%-shipping | 10%-website & operations </span> <br />
          </p>
          <p> <span class="subtitle-1 pink--text"> * Needs well thought out logistics for shipping </span> <br />
          <p>  </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt x-large
            to="/account" v-if="!registered && churches.length>0">
            帳戶設定
          </v-btn>
        </v-card-actions>
        <v-card-title class="headline">
          To be (F)ixed / (C)ompleted / (I)mplemented
        </v-card-title>
          <hr>
        <v-card-text>
          <p> page 404 (F) </p>
          <p> navigation buttons (back / refresh) (I) </p>
          <p> winning bids go off the list view to archive? </p>
          <p> winning bids time of payment indicator </p>
          <p> 'making offer' realtime ? </p>
          <p> allow video upload? </p>
          <p> a 'category' for items</p>
          <p> top 10 contributors? (I) </p>
          <p> product rating after award of bid (I) </p>
          <p> </p>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
// import { mapState } from 'vuex'
import { db, auth } from '../plugins/firebase.js'
// import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    // Logo,
    VuetifyLogo
  },
  data () {
    return {
      registered: true,
    }
  },
  computed:{
    churches(){
      return this.$store.state.churches
    }
  },
  mounted () {
    //this.sendEmail()
    this.getClientInfo()
    this.$store.dispatch('removeAllBackButtons')
    auth.onAuthStateChanged((user) => {
      if (user) {
        //console.log(user)
        this.$store.dispatch('setUser', user.uid) // dispatch for actions, can NOT pass in user directly
        this.checkReg()
        this.$store.dispatch('getChurches')
      } else {
        // not signed in
      }
    })
    auth.signInAnonymously().catch((e) => {
      // console.log(e)
      // this.$store.commit('setUser', this.$fireAuth.currentUser)
    })
  },
  methods: {
    // async sendEmail(){
    //   // const url = 'https://us-central1-garage-sale-to-donate.cloudfunctions.net/sendMail?dest=johnwcha@gmail.com'
    //   const url = 'https://us-central1-garage-sale-to-donate.cloudfunctions.net/sendMail'
    //   const res = await this.$http.$get(url)
    //   console.log(res)
    // },
    async getClientInfo() {
      // https://speak.usc.edu/206/myip.php
      const client_info = await this.$http.$get('https://speak.usc.edu/206/myip.php')
      console.log(client_info)
    },
    checkReg() {
      if (localStorage.gasdon_id) {
        this.registered = true
        const owner = {owner_id: localStorage.gasdon_id, 
                        avatar: localStorage.gasdon_avatar,
                        code: localStorage.gasdon_code}
        this.$store.dispatch('setOwner', owner)
        this.getWinningBids()
        // check membership
        db.collection('users').where('id', '==', localStorage.gasdon_id)
          .get().then(doc =>{
            //console.log(doc.docs[0].data().city)
            const userObj = doc.docs[0].data()
            this.$store.dispatch('setUserObj', userObj)
            if (doc.docs[0].data().membership=='admin') {
              this.$store.dispatch('setMembership')
              this.getWaitlist()
            }
          }).catch(e => { console.log(e.message) })
      } else {
        this.registered = false
        //this.getChurches()
      }
      this.$store.dispatch('setRegistered', this.registered)
    },
    getWinningBids(){
      var tmp = []
      // db.collection('items').where('winner', '==', 'lion_32735')
      db.collection('items').where('winner', '==', localStorage.gasdon_id)
        .get().then(docs =>{
          if (docs.size>0) {
            docs.forEach(item =>{
              //console.log(item.data())
              tmp.push({item_id: item.id, ...item.data()})
              // tmp.push(item.data())
            })
            this.$store.dispatch('setWinningBids', tmp)
          }
        }).catch(e =>{ console.log(e.message)})
    },
    getWaitlist () {
      var tmp = []
      db.collection('items').where('status', '==', '0')
        .orderBy('lastUpdate', 'desc')
        .get().then((querySnapshot) => {
          querySnapshot.forEach(doc =>{
            //console.log(doc.data())
            tmp.push(doc.data())
          })
          this.$store.dispatch('setWaitlist', tmp)
          // console.log(this.churches)
      })
    }
  }
}
</script>
