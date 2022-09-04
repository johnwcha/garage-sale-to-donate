<template>
  <v-card class="mb-2">
    <v-toolbar color="purple accent-3" dark>
      <v-toolbar-title> 付款 與 物流 </v-toolbar-title>
    </v-toolbar>

    <v-card-title> 編號： </v-card-title>
    <v-card-title> 應付款項：$ {{ amount }} </v-card-title>
    <v-card-title> Payment options: </v-card-title>
        <div v-for="(item, i) in payment" :key="'payment-'+i">
          <p class="ml-8"> {{i+1}}) {{ item }} </p>
        </div>
    <v-card-title> Shipping options: </v-card-title>
        <div v-for="(item, i) in shipping" :key="'shipping-'+i">
          <p class="ml-8"> {{i+1}}) {{ item }} </p>
        </div>

  </v-card>    
</template>

<script>
import { db } from '../plugins/firebase.js'

export default {
  props: ['amount'],
  data: () => ({
    payment: [],
    shipping: []
  }),
  mounted(){
    this.getShipping()
  },
  methods:{
    getShipping() {
      db.collection('paymentShipping').get().then(docs => {
        docs.forEach(item => {
          console.log(item.data())
          this.payment = item.data().payment
          this.shipping = item.data().shipping
        })
      }).catch(e => console.log(e.message))
    }
  }
}
</script>