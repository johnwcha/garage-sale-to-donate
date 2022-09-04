<template>
  <div>
      <!-- <div> {{ gasdon_id }} </div>
      <div> {{ obj }} </div> -->

    <v-simple-table>
        <template v-slot:default>
        <!-- <thead>
            <tr>
            <th class="text-left"> Name </th>
            <th class="text-left"> Calories </th>
            <th class="text-left"> Calories </th>
            </tr>
        </thead> -->
        <tbody>
            <tr @click="viewDetail(item)" v-for="item in winningbids" :key="item.itemName">
            <td> <v-img width="80" aspect-ratio="1"  :src="item.imagesURL[0]" /> </td>
            <td> <span class="charmd" min-width="40"> {{ item.itemName }} </span>
                <span v-if="item.winner" class="pink--text charmd"> ${{item.winningamount}} </span>
            </td>
            <td v-html="formatDate(item.winningtime)"> </td>
            <!-- <td v-html="item.tfn.split(' ').join('<br />')"> </td> -->
            <!-- <td>{{ item.winningtime.toDate().toString().split('GMT')[0] }}</td> -->
            <!-- <td v-html="item.winningtime.toDate().toString().split('GMT')[0]"> </td> -->
            <!-- <td v-html="dayjs(item.winningtime.toDate()).format('MM/DD/YYYY')"> </td> -->
            <!-- <td v-html="dayjs(item.winningtime.toDate()).format('MM/DD/YYYY') + '<br />' + dayjs(item.winningtime.toDate()).format('h:mm A')"> </td> -->
            </tr>
        </tbody>
        </template>
    </v-simple-table>

  </div>
</template>

<script>
import { db, storage } from '../plugins/firebase.js'

export default {
  data: () => ({
    panel: [0,1],
    gasdon_id: '',
    obj: null
  }),
  mounted(){
    // this.gasdon_id = localStorage.gasdon_id
    // this.obj = JSON.stringify(this.winningbids)
   this.$store.dispatch('removeAllBackButtons')
   if (!this.$store.state.registered) {
    this.$router.push('/')
   }
  },
  computed:{
    winningbids(){
      return this.$store.state.winningbids
    },
    dayjs(){
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
      return dayjs      
    }
  },
  methods: {
    formatDate(date){
      return this.dayjs(date.toDate()).format('MM-DD-YYYY') + '<br />' + this.dayjs(date.toDate()).format('h:mm A')
    },
    viewDetail(item){
      console.log(item)
      //this.$store.dispatch('setBacktoList', true)
      this.$store.dispatch('setDetails', item)
      this.$router.push('/winningItemDetails')
    },
  }
}
</script>

<style scoped>
.charlg {
  font-size: 24px;
  font-family: SimSum;
  color: blue;
}
.charmd {
  font-size: 20px;
  font-family: SimSum;
  color:blue;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  padding: 0 1px;
  transition: height 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
.v-expansion-panel-content__wrap {
  padding: 0 0px 5px;
  flex: 1 1 auto;
  max-width: 100%;
}

</style>
