<template>
  <div>

    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header> <span class="text-h6 pink--text">
          <v-icon class="mr-2 pink--text"> mdi-chart-bar-stacked </v-icon> 
          個人累計 </span> <span class="charmd"> $ {{mytotalStr}} </span></v-expansion-panel-header>
        <v-expansion-panel-content>
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
                  <tr @click="viewDetail(item)" v-for="item in myUploads" :key="item.itemName">
                    <td> <v-img width="80" aspect-ratio="1"  :src="item.imagesURL[0]" /> </td>
                    <td> <span class="charmd" min-width="40"> {{ item.itemName }} </span>
                        <span v-if="item.winner" class="pink--text charmd"> ${{item.winningamount}} </span>
                        </td>
                    <td v-html="item.tfn.split(' ').join('<br />')"> </td>
                    <!-- <td>{{ item.lastUpdate.toDate().toString().split('GMT')[0] }}</td> -->
                    <td> </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header> <span class="text-h6 blue--text">
          <v-icon class="mr-2 blue--text"> mdi-chart-bar </v-icon> 
          團體累計 </span> <span class="charmd"> $ {{grouptotalStr}} </span></v-expansion-panel-header>
        <v-expansion-panel-content>
          <p> * Maybe subtotal by categories here </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>
  </div>
</template>

<script>
import { db, storage } from '../plugins/firebase.js'

export default {
  data: () => ({
    panel: [0,1],
    myUploads: [],
    mytotal: 0,
    grouptotal: 0,
  }),
  mounted(){
   this.$store.dispatch('removeAllBackButtons')
   if (!this.$store.state.registered) {
    this.$router.push('/')
   }
   this.getMyItems()
   this.getTotalBidAmount()
  },
  computed:{
    mytotalStr(){
      return this.mytotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    grouptotalStr(){
      return this.grouptotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
  },
  methods: {
    viewDetail(item){
      console.log(item)
    },
    getMyItems() {
      this.myUploads = []
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
      if (this.$store.state.alias.length>1) {
        db.collection('items').where('owner', 'in', this.$store.state.alias)
          .orderBy('lastUpdate', 'desc').get().then(docs =>{
            //console.log(docs)
            if (!docs.empty){
              docs.forEach(doc =>{
                //console.log(doc.data())
                if (doc.data().winner) {
                  //console.log(doc.data())
                  const tfn = dayjs( doc.data().winningtime.toDate() ).format('MM-DD-YYYY h:mmA') 
                  this.mytotal += Number(doc.data().winningamount)
                  this.myUploads.push({tfn: tfn, item_id: doc.id, ...doc.data()})
                }
              })
            }
        })
      } else {
        db.collection('items').where('owner', '==', this.$store.state.owner_id)
          .orderBy('lastUpdate', 'desc').get().then(docs =>{
            //console.log(docs)
            if (!docs.empty){
              docs.forEach(doc =>{
                if (doc.data().winner) {
                  //console.log(doc.data())
                  const tfn = dayjs( doc.data().winningtime.toDate() ).format('MM-DD-YYYY h:mmA')
                  this.mytotal += Number(doc.data().winningamount)
                  this.myUploads.push({tfn: tfn, item_id: doc.id, ...doc.data()})
                }
              })
            }
        })
      }
    },
    getTotalBidAmount(){
      db.collection('items').where('winner', '!=', '').get().then(docs =>{
        docs.forEach(item =>{
          //console.log(item.data())
          this.grouptotal += Number(item.data().winningamount)
        })
      }).catch(e =>{ console.log(e.message)})
    }
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
