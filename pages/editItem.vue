<template>
  <div>
    <v-card>
      <v-card-title> 
        <span class="charlg"> <v-icon>mdi-upload</v-icon> 資料更新 </span>  
        <v-spacer />
        <v-btn outlined color="pink" @click="deleteItem">
          <v-icon>mdi-trash-can</v-icon> 刪除資料 </v-btn>
      </v-card-title>
      <v-card-title v-if="delSuccess">
        <v-spacer />
        成功刪除 <v-icon color="green"> mdi-check </v-icon>
      </v-card-title>
    </v-card>
        <v-form ref="form" class="my-5">

        <v-text-field class="charlg" v-model="itemName"
          label="品項名稱" required prepend-inner-icon="mdi-tag-text-outline"/>

        <v-text-field class="charlg" v-model="description"
          label="品項說明" required prepend-inner-icon="mdi-card-text-outline"/>

        <v-text-field class="charlg" v-model="quantity"
          label="品項數量" required prepend-inner-icon="mdi-counter"/>

        <v-file-input counter multiple show-size chips truncate-length="25"
          prepend-icon="mdi-camera" accept="image/*" required 
          @change="handleFile" />

        <v-progress-linear v-if="imageList.length>0" :value="progressUpload"></v-progress-linear>

        <div v-if="imageList.length>0">
          <!-- <v-img v-for="(url, i) in imageList" :key="i" :src='url' /> -->
            <v-card v-for="(url, i) in imageList" :key="i" class="mb-2">
                <v-toolbar> 照片 {{ i+1 }} </v-toolbar>
                <v-img :src="url" />
                <v-card-text style="height: 10px; position: relative">
                    <v-fab-transition>
                        <v-btn @click="removePic(i)"
                            color="pink" dark absolute top right fab>
                        <!-- <v-icon> mdi-minus </v-icon>  -->
                        刪除
                        </v-btn>
                    </v-fab-transition>
                </v-card-text>
            </v-card>
        </div>
        <!-- <input type="file" accept="image/*" multiple 
          @change="handleFile($event.target.files)"> -->

        <v-select class="charmd" v-model="condition"
          :items="conditions" label="新舊程度" required prepend-inner-icon="mdi-vector-difference-ba"/>

        <v-text-field class="charlg" v-model="year"
          label="購入年份" prepend-inner-icon="mdi-calendar"/>

        <v-text-field class="charlg" v-model="origPrice"
          label="購入價格（美元）" prepend-inner-icon="mdi-currency-usd"/>

        <v-text-field class="charlg" v-model="curPrice"
          label="目前市價" prepend-inner-icon="mdi-currency-usd" />

        <v-text-field class="charlg" v-model="url"
          label="同款新品鏈接" prepend-inner-icon="mdi-link"/>

        <v-select class="charmd" v-model="shipping"
          :items="shippings" label="物流方式" prepend-inner-icon="mdi-truck" />

        <v-checkbox v-model="checkbox" class="charlg"
          label="確認以上所填無誤" required />

        <!-- <v-btn :disabled="!valid || success" :loading="loading"
          color="success" class="ml-4" @click="submit">
          更新
        </v-btn> -->

        <v-btn color="primary" :disabled="!valid || success" :loading="loading"
          class="ml-4" @click="submit">
          更新
        </v-btn>

        <span v-if="success" class="charlg"> 成功更新 <v-icon color="green"> mdi-check </v-icon> </span>
      </v-form>

  </div>
</template>

<script>
import { db, storage } from '../plugins/firebase.js'

export default {
  data() {
    return {
      delSuccess: false,
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
      return this.itemName && this.description && this.quantity && this.condition && this.checkbox
    }
  },
  mounted () {
   this.itemName = this.$store.state.editItem.itemName
   this.description = this.$store.state.editItem.description
   this.quantity = this.$store.state.editItem.quantity 
   this.condition = this.$store.state.editItem.condition
   this.year = this.$store.state.editItem.year
   this.origPrice = this.$store.state.editItem.origPrice
   this.curPrice = this.$store.state.editItem.curPrice
   this.shipping = this.$store.state.editItem.shipping
   this.$store.state.editItem.imagesURL.forEach(url =>{
       this.imageList.push(url)
   })

   this.$store.dispatch('removeAllBackButtons')
   if (!this.$store.state.registered) {
    this.$router.push('/')
   }
//    console.log('編輯 ...')
//    console.log(this.$store.state.editItem)
  },
  methods: {
    deleteItem(){
      //console.log(this.$store.state.editItem)
      const id = this.$store.state.editItem.item_id
      db.collection('items').doc(id).update({
        status: '-1'
      }).then(() =>{
        this.delSuccess = true
        //console.log('success delete')
      }).catch(e => { console.log(e.message)})
    },
    removePic(index){
      this.imageList.splice(index, 1)
    },
    handleFile(fileList){
    //   console.log(fileList)
    //   this.imageList = []
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
    submit(){
      //console.log(this.$store.state.editItem.itemid)
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
      obj.status = '0'
      //console.log(obj)
      this.loading = true
      db.collection('items').doc(this.$store.state.editItem.itemid)
      .set(obj).then(doc => {
        this.success = true
        this.loading = false
      }).catch(error => { alert(error.message)})
    },
    // updateItem(item){
    //   this.$store.dispatch('updateItem', item)
    //   this.$router.push('/editItem')
    // }
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

</style>

