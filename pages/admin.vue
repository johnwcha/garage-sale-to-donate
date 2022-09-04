<template>
  <div>
    <v-card class="mx-auto mb-2" v-for="(item, i) in waitlist" :key="i">
      <v-carousel height="auto">
        <v-carousel-item eager
          v-for="(src,index) in item.imagesURL"
          :key="index" :src="src" 
        ></v-carousel-item>
      </v-carousel>

      <v-card-title> {{item.itemName}}
        ({{ item.year }})
      </v-card-title>

      <v-card-subtitle>
        <div class="subtitle-1">{{ item.description }} </div>
      </v-card-subtitle>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <span class="subtitle-1">新舊程度：</span>
          <v-rating
            :value="item.conditionNumber"
            color="amber"
            dense
            readonly
            size="14"
          />

          <div class="grey--text ml-4 subtitle-1">
            ({{ item.condition }})
          </div>
        </v-row>

        <div class="my-4 subtitle-1">
          數量：{{ item.quantity }} <br />
          購入價格：${{item.origPrice}} <br />
          目前市價：${{item.curPrice}} <br />
          <!-- 最後更新：{{ itemDetails.lastUpdate.toDate().toString().split('GMT')[0] }} <br /> -->
          最後更新：{{ item.lastUpdate }} <br />
          新品網站：<span v-if="item.newProductURL!=''">
              <a :href="item.newProductURL" target="_blank"> 點擊這裡 </a> (僅供參考)</span>
        </div>
      </v-card-text>

      <v-divider class="mx-4" />

      <v-card-text>
      <span class="subtitle-1">物流：</span>
        <v-chip-group
          v-model="item.selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>可郵寄</v-chip>
          <v-chip>需親自取</v-chip>
          <v-chip>可送貨到府</v-chip>
          <v-chip>另外安排</v-chip>
          <v-chip>以上皆可</v-chip>
        </v-chip-group>
      </v-card-text>

        <v-card-text style="height: 10px; position: relative">
            <v-fab-transition v-if="item.status=='0'">
                <v-btn @click="approve(item.item_id, i)"
                    color="primary" dark absolute top right fab>
                發佈
                </v-btn>
            </v-fab-transition>
            <v-fab-transition v-if="item.status=='1'">
                <v-btn @click="revert(item.item_id, i)"
                    color="pink" dark absolute top right fab>
                撤回
                </v-btn>
            </v-fab-transition>
        </v-card-text>


    </v-card>    
  </div>
</template>

<script>
import { db } from '../plugins/firebase.js'

export default {
  data: () => ({
    waitlist: [],
    imagesURL: [],
    itemName: '',
    year: '',
    description: '',
    condition: '',
    conditionNumber: 0, //Number(itemDetails.condition.split(' ')[0])
    origPrice: '',
    curPrice: '',
    lastUpdate: '', //dayjs(itemDetails.lastUpdate.toDate()).fromNow()
    newProductURL: '',
    shipping: ['可郵寄', '需親自取', '可送貨到府', '另外安排', '以上皆可'],
    selection: '',
    quantity: '',
  }),
  methods: {
    approve(id, index) {
      db.collection('items').doc(id).update({status: '1'}).then(() =>{
        this.waitlist[index].status = '1'
      })
    },
    revert(id, index) {
      db.collection('items').doc(id).update({status: '0'}).then(() =>{
        this.waitlist[index].status = '0'
      })
    }
  },
  mounted(){
    if (this.$store.state.membership=='admin') {
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
      db.collection('items').where('status', '==', '0')
        .orderBy('lastUpdate', 'desc')
        .get().then((querySnapshot) => {
          querySnapshot.forEach(doc =>{
            console.log(doc.data())
            this.waitlist.push({item_id: doc.id, ...doc.data()})
          })
          // console.log(this.churches)
            this.waitlist.forEach(item =>{
              console.log(item)
              item.selection = this.shipping.indexOf(item.shipping)
              item.conditionNumber = Number(item.condition.split(' ')[0])
              item.lastUpdate = dayjs(item.lastUpdate.toDate()).fromNow()
            })
      })
    } else {
      this.$router.push('/')
    }
  }
}

</script>