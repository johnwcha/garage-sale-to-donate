<template>
  <div>
    <v-card class="mx-auto mb-2">
      <v-carousel height="auto">
        <v-carousel-item eager
          v-for="(src,i) in imagesURL"
          :key="i" :src="src" 
        ></v-carousel-item>
      </v-carousel>

      <v-card-title> {{ itemName }}
        ({{ year }})
      </v-card-title>

      <v-card-subtitle>
        <div class="subtitle-1">{{ description }} </div>
      </v-card-subtitle>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <span class="subtitle-1">新舊程度：</span>
          <v-rating
            :value="conditionNumber"
            color="amber"
            dense
            readonly
            size="14"
          />

          <div class="grey--text ml-4 subtitle-1">
            ({{ condition }})
          </div>
        </v-row>

        <div class="my-4 subtitle-1">
          售價：${{ curPrice }} <br />
          數量：{{ quantity }} <br />
          所在地：{{ city }} <br />
          最後更新：{{ lastUpdate }} <br />
          新品價格：${{ origPrice }} <br />
          <!-- 最後更新：{{ itemDetails.lastUpdate.toDate().toString().split('GMT')[0] }} <br /> -->
          新品網站：<span v-if="newProductURL!=''">
              <a :href="newProductURL" target="_blank"> 點擊這裡 </a> (僅供參考)</span>
        </div>

      </v-card-text>

  <v-divider class="mx-4" />

      <v-card-text>
        <span class="subtitle-1">物流：</span>
        <v-chip-group v-model="selection" column
          active-class="deep-purple accent-4 white--text">
          <v-chip>可郵寄</v-chip>
          <v-chip>需親自取</v-chip>
          <v-chip>可送貨到府</v-chip>
          <v-chip>另外安排</v-chip>
          <v-chip>以上皆可</v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-btn v-if="!self" outlined class="mr-3" color="deep-purple lighten-2" text>
          售價
        </v-btn>
        <v-text-field v-model="curPrice" v-if="!self" prepend-inner-icon="mdi-currency-usd"></v-text-field>
        <v-checkbox @click="checkReg" v-model="purchase" class="mr-2" label="購買">  </v-checkbox>
        <v-btn :disabled="!purchase" :loading="loading"
          color="deep-purple lighten-2" text @click="makePurchase">
          <v-icon left> mdi-send </v-icon>
          確認
        </v-btn>
      </v-card-actions>


      <!-- <v-card-actions>
        <v-btn v-if="!self" outlined class="mr-3" color="deep-purple lighten-2" text>
          出價
        </v-btn>
        <v-text-field v-model="amount" v-if="!self" prepend-inner-icon="mdi-currency-usd"></v-text-field>
        <v-btn v-if="!self" :loading="loading"
          color="deep-purple lighten-2" text @click="makeOffers">
          <v-icon left> mdi-send </v-icon>
          送出
        </v-btn>
      </v-card-actions> -->

  <v-list>
    <!-- <v-subheader> Recent Offers </v-subheader> -->
    <template v-for="(item, index) in offerList">

      <v-list-item :key="index">
        <v-list-item-avatar :tile="true" size="48">
          <v-img :src="item.url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="item.amounthtml" />
          <v-list-item-subtitle v-html="item.date" />
        </v-list-item-content>
        <v-list-item-icon v-if="item.ownOffer">
          <v-icon color="green"> mdi-star </v-icon>
        </v-list-item-icon>

          <v-list-item-icon>
            <v-btn v-if="item.from==item.winner"
              small outlined class="mr-1 pink--text"> 
              <v-icon> mdi-lock-outline </v-icon> 得標 </v-btn>
          </v-list-item-icon>
          <v-list-item-icon>
            <v-btn :disabled="haswinner" v-if="self" @click="winningBid(item)"
              small outlined color="warning" class="mr-1"> 
              <v-icon> mdi-gavel </v-icon> 出讓 </v-btn>
          </v-list-item-icon>

      </v-list-item>
    </template>
  </v-list>
    </v-card>


  <!-- <v-card class="mb-2" >
    <v-toolbar color="pink" dark>
      <v-toolbar-title> 付款 與 物流 </v-toolbar-title>
    </v-toolbar>
  </v-card> -->

  <pay-ship v-if="showPaymentInfo" />

  <v-card class="mb-2" v-if="pmchats.length>0">
    <v-toolbar color="pink" dark>
      <v-toolbar-title> 私訊 </v-toolbar-title>
    </v-toolbar>

<!-- <reply to pm 私訊 messages> -->
      <!-- <v-card-actions v-if="pmreplyavatar!=''"> -->
      <v-card-actions v-if="show_replyChat_pm">
        <span class="mr-2"> 私訊回覆 
          <img height="36" width="36" :src="pmreplyavatar" />
        </span>
        <v-text-field v-model="pmreplytext" color="pink"></v-text-field>
        <v-btn :loading="loading" text color="pink" 
          @click="pmsendReply">
          <v-icon left> mdi-send </v-icon>
          送出
        </v-btn>
      </v-card-actions>

    <v-list three-line>
      <template v-for="(item, index) in pmchats">
        <v-list-item :key="index">
          <v-list-item-avatar tile>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="textheight" v-html="item.chat_h6"></v-list-item-subtitle>
            <v-list-item-subtitle  v-html="item.tfn"></v-list-item-subtitle>
          </v-list-item-content>

          <!-- <v-list-item-action>
            <v-list-item-action-text v-if="item.pm" > 私訊 to {{item.to}} </v-list-item-action-text>
          </v-list-item-action> -->

          <v-list-item-icon>
            <v-btn v-if="item.fromme" small outlined
              @click="delpmchat(item)" color="orange" class="mr-1"> 刪除 </v-btn>
            <v-btn @click="replypmchat(item)" small outlined color="green"> 回覆私訊 </v-btn>
          </v-list-item-icon>
        </v-list-item>

    <!-- pm <reply> -->
        <v-simple-table>
          <!-- <thead>
            <tr>
              <th class="text-left"> from </th>
              <th class="text-left"> message </th>
              <th class="text-left"> time </th>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="(res, i) in item.reply_tfn" :key="i">
              <td> </td>
              <td> <v-icon class="pink--text" small v-if="res.from==$store.state.owner_id"> mdi-star </v-icon>
                <v-img height="36" width="36" :src="res.avatar"></v-img> </td>
              <td> <span class="mt-2" v-html="res.txt"> </span> </td> 
              <td> <span  class="mb-2" v-html="res.tfn"> </span> </td>
            </tr>
          </tbody>
        </v-simple-table>


      </template>
    </v-list>
  </v-card>


  <v-card>
    <v-toolbar color="light-blue" dark>
      <v-toolbar-title>討論 ／ 留言</v-toolbar-title>
    </v-toolbar>

      <!-- <send messages> -->
      <v-card-actions v-if="replyavatar==''">
        <v-checkbox v-model="pm" class="mr-2" label="私訊">  </v-checkbox>
        <v-text-field v-model="chattext" color="deep-purple lighten-2"
          prepend-icon="mdi-chat"></v-text-field>
        <v-btn :loading="loading" text color="deep-purple lighten-2" 
          @click="sendChat">
          <v-icon left> mdi-send </v-icon>
          送出
        </v-btn>
      </v-card-actions>
      <!-- <reply to messages> -->
      <v-card-actions v-if="replyavatar!=''">
      <!-- <v-card-actions v-if="show_replyChat"> -->
        <span class="mr-2"> 回覆 
          <img height="36" width="36" :src="replyavatar" />
        </span>
        <v-text-field v-model="replytext" color="pink"></v-text-field>
        <v-btn :loading="loading" text color="pink" 
          @click="sendReply">
          <v-icon left> mdi-send </v-icon>
          送出
        </v-btn>
      </v-card-actions>

    <v-list three-line>
      <template v-for="(item, index) in chats">
        <v-list-item :key="index">
          <v-list-item-avatar tile>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle class="textheight" v-html="item.chat_h6"></v-list-item-subtitle>
            <v-list-item-subtitle  v-html="item.tfn"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-icon>
            <v-btn v-if="item.fromme" @click="delChat(item.msg_id)"
              small outlined color="orange" class="mr-1"> 刪除 </v-btn>
            <v-btn small outlined color="green" @click="replyChat(item)"> 回覆 </v-btn>
          </v-list-item-icon>
        </v-list-item>

            <!-- <reply> -->
        <v-simple-table>
          <!-- <thead>
            <tr>
              <th class="text-left"> from </th>
              <th class="text-left"> message </th>
              <th class="text-left"> time </th>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="(res, i) in item.reply_tfn" :key="i">
              <td> </td>
              <td> <v-icon class="pink--text" small v-if="res.from==$store.state.owner_id"> mdi-star </v-icon>
                <v-img height="36" width="36" :src="res.avatar"></v-img> </td>
              <td> <span class="mt-2" v-html="res.txt"> </span> </td> 
              <td> <span  class="mb-2" v-html="res.tfn"> </span> </td>
            </tr>
          </tbody>
        </v-simple-table>

      </template>
    </v-list>

  </v-card>
    
  </div>
</template>

<script>
import { db } from '../plugins/firebase.js'
import firebase from 'firebase/app'
import 'firebase/firebase-storage'
import PayShip from '~/components/PaymentShipping'

export default {
  components: {
    PayShip
  },
  data: () => ({
    showPaymentInfo: false,
    purchase: false,
    haswinner: false,
    pmreply_msg_id: '',
    pmreplyavatar: '',
    pmreplytext: '',
    reply_msg_id: '',
    replyavatar: '',
    replytext: '',
    //show_replyChat: false,
    show_replyChat_pm: false,
    pm: false,
    amount: '',
    offerList: [],
    chats: [],
    pmchats: [],
    loading: false,
    shipping: ['可郵寄', '需親自取', '可送貨到府', '另外安排', '以上皆可'],
    chattext: '',
    unsubscribe: null,
    itemDetails: {},
    imagesURL: [],
    itemName: '',
    year: '',
    quantity: '',
    city: '',
    description: '',
    condition: '',
    conditionNumber: 0, //Number(itemDetails.condition.split(' ')[0])
    origPrice: '',
    curPrice: '',
    lastUpdate: '', //dayjs(itemDetails.lastUpdate.toDate()).fromNow()
    newProductURL: '',
    selection: '',
    self: false,
  }),
  computed: {
  },
  methods: {
    getWinningBids(){
      var tmp = []
      // db.collection('items').where('winner', '==', 'lion_32735')
      db.collection('items').where('winner', '==', this.$store.state.owner_id)
        .orderBy('winningtime', 'desc').get().then(docs =>{
          if (docs.size>0) {
            docs.forEach(item =>{
              //console.log(item.data())
              tmp.push({item_id: item.id, ...item.data()})
            })
            this.$store.dispatch('setWinningBids', tmp)
          }
        }).catch(e =>{ console.log(e.message)})
    },
    checkReg(){
      console.log(this.purchase)
      if (this.purchase) {
        console.log('check registration')
        if (!this.$store.state.registered) {
          this.$router.push('/account')
        }
      }
    },
    makePurchase(){
      console.log('buying the item ---------------------------------')
      console.log(this.itemDetails)
      const from = this.$store.state.owner_id
      // also update ITEM collection
      const item = this.itemDetails
      db.collection('items').doc(item.item_id).update({
        winner: from, winningamount: item.curPrice, winningtime: new Date()
      }).then(() =>{
        console.log('success update Items collection')
        // the update will trigger :: send email
        // add PAYMENT document
        this.showPaymentInfo = true
        this.getWinningBids()
      }).catch(e => { console.log(e.message)})
    },
    // async sendEmail(){
    //   const url = 'https://us-central1-garage-sale-to-donate.cloudfunctions.net/sendMail?dest=johnwcha@gmail.com'
    //   const res = await this.$http.$get(url)
    //   console.log(res)
    // },
    winningBid(item) {
      //console.log('winning bid', item)
      db.collection('offers').doc(item.offerid).update({
        winner: item.from
      }).then(() =>{
        //console.log('success')
        this.updateOffers()
        item.winner = item.from
      }).catch(e => { console.log(e.message)})
      // also update ITEM collection
      db.collection('items').doc(item.item_id).update({
        winner: item.from, winningamount: item.amount, winningtime: new Date()
      }).then(() =>{
        console.log('success update Items collection')
        // the update will trigger :: send email
      }).catch(e => { console.log(e.message)})
      // add PAYMENT document

    },
    pmsendReply(){
      const txt = this.pmreplytext.trim()
      if (txt==!'') {
        db.collection('discussions').doc(this.pmreply_msg_id).update({
          reply: firebase.firestore.FieldValue.arrayUnion({
            from: this.$store.state.owner_id, txt: txt, time: new Date(), avatar: this.pmreplyavatar
          })
        }).then(res =>{
            this.pmreplyavatar = ''
            this.pmreplytext = ''
          }).catch(e =>{ console.log(e.message)})
      }
    },
    delpmchat(item) {
      console.log('delete pm chat', item)
    },
    replypmchat(item){
      //console.log('reply to pm chat', item)
      this.show_replyChat_pm = !this.show_replyChat_pm
      this.pmreply_msg_id = item.msg_id
      this.pmreplyavatar = 'https://speak.usc.edu/206/duoting/assets/' + 
                    item.from.split('_')[0] + '.png'
    },
    sendReply(){
      const txt = this.replytext.trim()
      if (txt==''){
        this.replyavatar = ''
      } else {
        //console.log('send reply', txt, )
        const url = 'https://speak.usc.edu/206/duoting/assets/' + 
                    this.$store.state.owner_id.split('_')[0] + '.png'
        db.collection('discussions').doc(this.reply_msg_id).update({
          reply: firebase.firestore.FieldValue.arrayUnion({
            from: this.$store.state.owner_id, txt: txt, time: new Date(), avatar: url
          })
        }).then(res =>{
          this.replyavatar = ''
          //console.log(res)
        }).catch(e => { console.log(e.message)})
      }
    },
    replyChat(item){
      //console.log(item)
      // this.show_replyChat = !this.show_replyChat
      this.reply_msg_id = item.msg_id
      this.replyavatar = item.avatar
    },
    delChat(id) {
      db.collection('discussions').doc(id).update({visible: false}).then(() =>{
        //console.log('delete success')
      }).catch(e => { console.log(e.message) })
    },
    sendChat(){
      // console.log(this.itemDetails)
      // console.log(this.$store.state.owner_id)
      const obj = {item_id: this.itemDetails.item_id, 
                  from: localStorage.gasdon_id,
                  chat: this.chattext.trim(), time: new Date(),
                  reply: [], visible: true, pm: this.pm, 
                  to: this.$store.state.itemDetails.owner}
      if (this.chattext.trim()!='') {
        this.loading = true
        db.collection('discussions').add(obj).then(res =>{
          // console.log(res.id)
          this.loading = false
          this.chattext = ''
        }).catch(e => { alert(e.message) })
      }
    },
    makeOffers (){
      this.loading = true
      const offerObj = {item_id: this.$store.state.itemDetails.item_id,
        item_owner: this.$store.state.itemDetails.owner, 
        itemName: this.$store.state.itemDetails.itemName, 
        from: localStorage.gasdon_id, winner: '',
        amount: this.amount.trim(), time: new Date()}
      db.collection('offers').add(offerObj).then(doc =>{
        //console.log(doc.id)
        this.loading = false
        this.updateOffers()
      }).catch(e => {alert(e.message)})
    },
    updateOffers(){
      const item_id = this.$store.state.itemDetails.item_id
      db.collection('offers').where('item_id', '==', item_id)
        .orderBy('time', 'desc').get().then(docs =>{
        this.offerList = []
        var dayjs = require('dayjs')
        var relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        docs.forEach(item =>{
          if (item.data().winner!='') {
            this.haswinner = true
          }
          //console.log(item.data())
          //const date = item.data().time.toDate().toString().split('GMT')[0]
          const date = dayjs(item.data().time.toDate()).fromNow()
          const url = 'https://speak.usc.edu/206/duoting/assets/'+item.data().from.split('_')[0]+'.png'
          const amounthtml = '<span class="text-h6"> $ ' + item.data().amount + '</span>'
          const ownOffer = this.$store.state.alias.includes(item.data().from)
          this.offerList.push({offerid: item.id, amounthtml: amounthtml, date: date, 
              url: url, ownOffer: ownOffer, ...item.data()})
        })
        //console.log(this.offerList)
      }).catch(e =>{ console.log(e.message)})
    }
  },
  mounted () {
    //console.log(this.$store.state.itemDetails)
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
    if (this.$store.state.itemDetails===null) {
      this.$router.push('/')
    } else {
      this.itemDetails = this.$store.state.itemDetails
      this.imagesURL = this.$store.state.itemDetails.imagesURL
      this.itemName = this.$store.state.itemDetails.itemName
      this.year = this.$store.state.itemDetails.year
      this.quantity = this.$store.state.itemDetails.quantity
      this.city = this.$store.state.itemDetails.city
      this.description = this.$store.state.itemDetails.description
      this.condition = this.$store.state.itemDetails.condition
      this.conditionNumber = Number(this.condition.split(' ')[0])
      this.origPrice = this.$store.state.itemDetails.origPrice
      this.curPrice = this.$store.state.itemDetails.curPrice
      this.lastUpdate = dayjs(this.$store.state.itemDetails.lastUpdate.toDate()).fromNow()
      this.newProductURL = this.$store.state.itemDetails.newProductURL
      const select = this.$store.state.itemDetails.shipping
      this.selection = this.shipping.indexOf(select)
      this.self = this.$store.state.alias.includes(this.$store.state.itemDetails.owner)
    }
    console.log('item details view')
    this.updateOffers()
    this.unsubscribe = db.collection('discussions')
      .where('item_id', '==', this.itemDetails.item_id)
      .where('visible', '==', true)
      .orderBy('time', 'desc')
      .onSnapshot(docs =>{
      //console.log(docs.docs)
      this.chats = []
      this.pmchats = []
      docs.docs.forEach(doc =>{
        //console.log(doc.data())
        const fromme = doc.data().from==this.$store.state.owner_id ? true : false
        const chat_h6 = '<span class="text-subtitle-1 blue--text">' + doc.data().chat + '</span>'
        const timefromnow = dayjs(doc.data().time.toDate()).fromNow()
        const avatar = 'https://speak.usc.edu/206/duoting/assets/'+doc.data().from.split('_')[0]+'.png'
        let reply_tfn = []
        if (doc.data().reply.length>0) {
          doc.data().reply.forEach(rep =>{
            const tfn = dayjs(rep.time.toDate()).fromNow()
            reply_tfn.push({from: rep.from, avatar: rep.avatar, tfn: tfn, txt: rep.txt})
          })
        }
        if (doc.data().pm) {
          if (doc.data().to === this.$store.state.owner_id || doc.data().from === this.$store.state.owner_id) { 
            this.pmchats.push({fromme: fromme, chat_h6: chat_h6, tfn: timefromnow, 
              avatar: avatar, msg_id: doc.id, reply_tfn: reply_tfn, ...doc.data()})
          }
        } else {
          this.chats.push({fromme: fromme, chat_h6: chat_h6, tfn: timefromnow, 
              avatar: avatar, msg_id: doc.id, reply_tfn: reply_tfn, ...doc.data()})
        }
      })
      //console.log(this.chats)
    })
  },
  beforeDestroy(){
    this.unsubscribe()
  }
}
</script>

<style scoped>
.textheight {
  font-size: 1rem !important;
  font-weight: normal;
  line-height: 0.5rem;
  letter-spacing: 0.009375em !important;
  font-family: "Roboto", sans-serif !important;
}

</style>