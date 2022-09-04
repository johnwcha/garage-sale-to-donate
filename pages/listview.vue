<template>
  <v-list three-line>
    <template v-for="(item, index) in items">
      <!-- <v-subheader
        v-if="item.header"
        :key="item.header"
        v-text="item.header"
      /> -->

      <!-- <v-divider
        v-if="item.divider"
        :key="index"
        :inset="item.inset"
      /> -->

      <v-list-item
        :key="item.title"
        @click="viewDetail(item, index)"
      >
        <v-list-item-avatar :tile="true" size="80">
          <v-img :src="item.imagesURL[0]" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-html="item.itemName" />
          <v-list-item-subtitle v-html="item.description" />
            <span v-if="item.winner" class="pink--text"> ${{ item.winningamount }} <v-icon small class="pink--text"> mdi-lock </v-icon> </span>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text v-text="item.lastUpdateDate"></v-list-item-action-text>
          <v-rating
            :value="Number(item.condition.split(' ')[0])"
            color="amber"
            dense
            readonly
            size="14"
          />
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { db } from '../plugins/firebase.js'

export default {
  data: () => ({
    items: [],
  }),
  mounted () {
   this.$store.dispatch('removeAllBackButtons')
  //  if (!this.$store.state.registered) {
   if (this.$store.state.uid=='') {
    this.$router.push('/')
   } else {
     this.getList()
   }
   console.log('list view')
  },
  methods: {
    getList(){
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
      db.collection('items').where('status', '==', '1')
        .orderBy('lastUpdate', 'desc').get().then(docs =>{
        docs.forEach(doc => {
          //console.log(dayjs(doc.data().lastUpdate.toDate()).fromNow())
          if (!doc.data().winner) { 
            const lastUpdateDate = dayjs(doc.data().lastUpdate.toDate()).fromNow()
            this.items.push({item_id: doc.id, lastUpdateDate: lastUpdateDate, ...doc.data()})
            //console.log(typeof(doc.data().lastUpdate.toDate().toString()))
          }
        })
      }).catch(error => { console.log(error.message)})
    },
    viewDetail (item, index) {
      console.log(item, index)
      this.$store.dispatch('setBacktoList', true)
      this.$store.dispatch('setDetails', item)
      this.$router.push('/itemDetails')
    }
  },
  beforeDestroy(){
    //this.$store.dispatch('setBacktoList', false)
  }
}
</script>

<style scoped>
.v-list-item__content {
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
}
.v-list-item {
  padding: 0px 0px 0px 0px;
  margin-top: 0px 0px 0px 0px;
}
.v-list-item__avatar {
  margin: 0px 8px 0px 0px;
}
.v-list--three-line .v-list-item .v-list-item__avatar,
.v-list--three-line .v-list-item .v-list-item__action,
.v-list-item--three-line .v-list-item__avatar,
.v-list-item--three-line .v-list-item__action {
  align-self: flex-start;
  margin-top: 0px;
  margin-bottom: 0px;
}
.v-rating--dense .v-icon {
  padding: 0px;
}
</style>
