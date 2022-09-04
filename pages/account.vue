<template>
  <v-row>
    <v-col cols="12">

      <v-row>
          <v-col sm="12" md="4">
          </v-col>  
          <v-col sm="12" md="4">
              <v-img height="128" width="128" :eager="true" :src="avatar"> </v-img>
          </v-col>  
          <v-col sm="12" md="4">
          </v-col>  
      </v-row>

      <v-form ref="form">

        <v-text-field class="charlg" v-model="image"
          label="用戶圖像" required :disabled="true" />

        <v-text-field
          class="charlg"
          v-model="passcode"
          label="用戶代碼"
          required
          :disabled="true"
        />

        <v-select
          class="charlg"
          v-model="select"
          :items="churches"
          label="所在城市"
          required
        />

        <v-text-field
          class="charlg"
          v-model="email"
          label="E-mail (optional)"
          :rules="[rules.email]"
        />

        <v-text-field
          class="charlg"
          v-model="phone"
          label="Phone (optional)"
          counter
          maxlength="10"
          :rules="[rules.counter]"
        />

        <v-checkbox
          v-model="checkbox"
          class="charlg"
          label="確認以上所填無誤"
          required
        />

        <v-btn v-if="!registered" :disabled="!valid"
          color="success" class="ml-4" @click="submit">
          提交
        </v-btn>

        <v-btn v-if="registered" color="primary" :disabled="!valid"
          class="ml-4" @click="update">
          更新
        </v-btn>

        <span v-if="success" class="charlg"> 成功提交 <v-icon color="green"> mdi-check </v-icon> </span>
      </v-form>

    </v-col>
  </v-row>
</template>

<script>
import { db } from '../plugins/firebase.js'
import {shuffle} from '~/util/functions'

export default {
  data: () => ({
    success: false,
    avatar: '',
    image: '',
    passcode: '',
    email: '',
    phone: '',
    docid: '',
    select: null,
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 10 || 'Max 10 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
    checkbox: false
  }),
  computed: {
    registered () {
      return this.$store.state.registered
    },
    valid(){
      return this.select && this.checkbox
    },
    churches(){
      let temp = []
      this.$store.state.churches.forEach(church =>{
        temp.push(church.city)
      })
      return temp
    }
  },
  mounted () {
   this.$store.dispatch('removeAllBackButtons')
   if (this.$store.state.uid==='') {
    this.$router.push('/')
   } else {
    if (!localStorage.gasdon_avatar) {
      const code = new Date().getTime().toString()
      this.passcode = code.substring( code.length-5 )
      //console.log(this.passcode)
      this.avatar = 'https://speak.usc.edu/206/duoting/assets/' + shuffle(this.$store.state._animals)[0]
      // this.avatar = this.$store.state.avatar_site + shuffle(this.$store.state._animals)[0]
      const temp = this.avatar.split('/assets/')
      const tmp = temp[1].split('.png')
      this.image = tmp[0]
   } else {
      // read from localStorage
      const id = localStorage.gasdon_id
      this.passcode = localStorage.gasdon_code
      this.avatar = localStorage.gasdon_avatar
      const temp = this.avatar.split('/assets/')
      const tmp = temp[1].split('.png')
      this.image = tmp[0]
      // get info from firebase
      db.collection('users').where('id', '==', id).get().then(doc =>{
        //console.log(doc)
        if (doc.size>1) {
          alert('Problem! Contact admin.')
        } else if (doc.size==1) {
          this.$store.dispatch('setRegistered', true)
          doc.forEach(item => {
            console.log(item.data())
            this.select = item.data().city
            this.email = item.data().email
            this.phone = item.data().phone
            this.docid = item.id
          })
        }
      }).catch(err => { alert(err.message) } )
    }
   }
  },
  methods: {
    submit(){
      console.log('save account info')
      const obj = {id: this.image+'_'+this.passcode, city: this.select,
            avatar: this.avatar, 
            membership: 'user', phone: this.phone, email: this.email, time: new Date()}
      this.$store.dispatch('setUserObj', obj)

      db.collection('users').add(obj).then(res =>{
        //console.log(res.id)
        this.docid = res.id
        localStorage.gasdon_avatar = this.avatar
        localStorage.gasdon_code = this.passcode
        localStorage.gasdon_id = this.image+'_'+this.passcode
        this.success = true
        this.$store.dispatch('setRegistered', true)
      }).catch(err => { console.error(err.message)})
    },
    update () {
      if (this.docid!=''){
        const obj = {city: this.select, email: this.email, phone: this.phone}
        db.collection('users').doc(this.docid).update(obj).then(()=>{
          this.success = true
        }).catch(err => { alert(err.message) })
      }
    }
  }
}
</script>

<style scoped>
.charlg {
  font-size: 24px;
}
</style>
