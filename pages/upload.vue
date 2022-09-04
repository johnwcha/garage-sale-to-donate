<template>
  <div>
    <v-card>
      <v-card-title> 
        <span class="charlg"> <v-icon>mdi-upload</v-icon> 物品上傳 </span>  
      </v-card-title>
    </v-card>
        <v-form ref="form" class="my-5">

        <v-text-field class="charlg" v-model="itemName"
          label="名稱 (Item)" required prepend-inner-icon="mdi-tag-text-outline"/>

        <v-text-field class="charlg" v-model="description"
          label="說明 (Description)" required prepend-inner-icon="mdi-card-text-outline"/>

        <v-text-field class="charlg" v-model="quantity"
          label="數量 (Quantity)" required prepend-inner-icon="mdi-counter"/>

        <v-file-input counter multiple show-size chips truncate-length="25"
          prepend-icon="mdi-camera" accept="image/*" required 
          @change="handleFile" />

        <v-progress-linear v-if="imageList.length>0" :value="progressUpload"></v-progress-linear>

        <div v-if="imageList.length>0">
          <v-img v-for="(url, i) in imageList" :key="i" :src='url' />
        </div>
        <!-- <input type="file" accept="image/*" multiple 
          @change="handleFile($event.target.files)"> -->

        <v-select class="charmd" v-model="condition"
          :items="conditions" label="新舊程度 (Condition)" required prepend-inner-icon="mdi-vector-difference-ba"/>

        <v-text-field class="charlg" v-model="year"
          label="購入年份 (Year purchased)" prepend-inner-icon="mdi-calendar"/>

        <v-text-field class="charlg" v-model="origPrice"
          label="購入價格（美元, Price purchased）" prepend-inner-icon="mdi-currency-usd"/>

        <v-text-field class="charlg" v-model="curPrice"
          label="目前市價 (Current value)" prepend-inner-icon="mdi-currency-usd" />

        <v-text-field class="charlg" v-model="url"
          label="同款新品鏈接" prepend-inner-icon="mdi-link"/>

        <v-select class="charmd" v-model="shipping"
          :items="shippings" label="物流 (shipping & handling)" prepend-inner-icon="mdi-truck" />

        <v-checkbox v-model="checkbox" class="charlg"
          label="確認以上所填無誤 (Correct info above)" required />

        <v-btn :disabled="!valid || success" :loading="loading"
          color="success" class="ml-4" @click="submit">
          上傳
        </v-btn>

        <!-- <v-btn v-if="registered" color="primary" :disabled="!valid"
          class="ml-4" @click="update">
          更新
        </v-btn> -->

        <span v-if="success" class="charlg"> 成功上傳 (Success) <v-icon color="green"> mdi-check </v-icon> </span>
      </v-form>

    <v-card class="my-2">
      <v-card-title> 
        <span class="charlg"> <v-icon>mdi-upload-outline</v-icon> 已上傳物品 (Uploaded items) </span>  
      </v-card-title>
    </v-card>

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
                  <tr @click="viewDetail(item)" v-for="(item, i) in myUploads" :key="i">
                    <td> <v-img width="80" aspect-ratio="1"  :src="item.imagesURL[0]" /> </td>
                    <td> <span class="charmd" min-width="40"> {{ item.itemName }} </span>
                        <span v-if="item.status=='0'" class="pink--text"> 核實中 ⌛️ </span>
                        <span v-if="item.winner" class="pink--text charmd"> ${{item.winningamount}} </span>
                        </td>
                    <td>{{ item.tfn }}</td>
                    <!-- <td>{{ item.lastUpdate.toDate().toString().split('GMT')[0] }}</td> -->
                    <td>
                      <v-btn v-if="!item.winner" fab dark small color="cyan" 
                        @click.stop="updateItem(item)">
                        <v-icon dark> mdi-pencil </v-icon>
                      </v-btn>
                      <v-btn v-if="item.winner" fab dark small color="pink">
                        <v-icon dark> mdi-gavel </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

  </div>
</template>

<script>
import { db, storage } from '../plugins/firebase.js'

export default {
  data() {
    return {
      itemName: '',
      description: '',
      quantity: '',
      condition: null,
      conditions: ['1 堪用（有破損）', '2 還行（無破損）', '3 還算滿意', '4 非常不錯', '5 全新'],
      checkbox: null,
      selectedFiles: null,
      success: false,
      year: '',
      origPrice: '',
      curPrice: '',
      url: '',
      shipping: '',
      shippings: ['可郵寄', '需親自取', '可送貨到府', '另外安排', '以上皆可'],
      progressUpload: 0,
      uploadTask: '',
      imageList: [],
      loading: false,
      myUploads: [],
    }
  },
  computed: {
    registered () {
      return this.$store.state.registered
    },
    valid () {
      return this.itemName && this.condition && this.checkbox
    },
  },
  mounted () {
   this.$store.dispatch('removeAllBackButtons')
   if (!this.$store.state.registered) {
    this.$router.push('/')
   }
   this.getMyItems()
   //console.log('updated 5')
  },
  methods: {
    viewDetail (item) {
      //console.log(item)
      //this.$store.dispatch('setBacktoList', true)
      this.$store.dispatch('setDetails', item)
      this.$router.push('/itemDetails')
    },
    handleFile(fileList){
      //console.log(fileList)
      this.imageList = []
      const path = localStorage.gasdon_id + '/'
      fileList.forEach(file => {
        const uploadTask = storage.ref(path).child(file.name).put(file)
        uploadTask.on('state_changed', snapshot => {
          this.progressUpload = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes * 100)
          //console.log(this.progressUpload)
        }, 
        (error) => {
          // Handle unsuccessful uploads
          alert('上傳出現問題', error.code)
        }, 
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            //this.$emit('url', downloadURL)
            this.imageList.push(downloadURL)
            //console.log(file.name)
          })
        })

      })
    },
    getMyItems() {
      this.myUploads = []
      var dayjs = require('dayjs')
      var relativeTime = require('dayjs/plugin/relativeTime')
      dayjs.extend(relativeTime)
      console.log(this.$store.state.alias)
      if (this.$store.state.alias.length>1) {
        db.collection('items').where('owner', 'in', this.$store.state.alias)
          .orderBy('lastUpdate', 'desc').get().then(docs =>{
            console.log(docs)
            if (!docs.empty){
              docs.forEach(doc =>{
                //if (doc.data().winner) console.log(doc.data())
                const tfn = dayjs( doc.data().lastUpdate.toDate() ).fromNow()
                //dayjs(item.lastUpdate.toDate()).fromNow()
                if (doc.data().status!='-1')
                  this.myUploads.push({tfn: tfn, item_id: doc.id, ...doc.data()})
              })
            }
        })
      } else {
        db.collection('items').where('owner', '==', this.$store.state.owner_id)
          .orderBy('lastUpdate', 'desc').get().then(docs =>{
            if (!docs.empty){
              console.log(docs)
              docs.forEach(doc =>{
                console.log(doc.data())
                const tfn = dayjs( doc.data().lastUpdate.toDate() ).fromNow()
                if (doc.data().status!='-1')
                  this.myUploads.push({tfn: tfn, item_id: doc.id, ...doc.data()})
              })
            }
        })
      }
    },
    submit(){
      //console.log(this.$store.state.userObj)
      var obj = {}
      obj.owner = localStorage.gasdon_id
      obj.itemName = this.itemName
      obj.description = this.description
      obj.quantity = this.quantity
      obj.condition = this.condition
      obj.imagesURL = this.imageList
      obj.year = this.year
      obj.origPrice = this.origPrice
      obj.curPrice = this.curPrice
      obj.newProductURL = this.url
      obj.shipping = this.shipping
      obj.lastUpdate = new Date()
      obj.status = '0' // first upload
      obj.city = this.$store.state.userObj.city
      //console.log(obj)
      this.loading = true
      db.collection('items').add(obj).then(doc => {
        this.success = true
        this.loading = false
        console.log('----------- upload success, get list of my items')
        this.getMyItems()
      }).catch(error => { alert(error.message)})
    },
    updateItem(item){
      this.$store.dispatch('updateItem', item)
      this.$router.push('/editItem')
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

</style>
