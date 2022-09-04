<template>
  <div>
    <div class="d-flex text-h5 mb-2"> 消息發佈 </div>

    <v-expansion-panels
      v-model="panel"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header> <span class="text-h6 pink--text">
          <v-icon class="mr-2 pink--text"> mdi-gesture-swipe </v-icon> 軟件使用 </span></v-expansion-panel-header>
        <v-expansion-panel-content>
          Some content
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header> <span class="text-h6 blue--text">
          <v-icon class="mr-2 blue--text"> mdi-cog </v-icon> 系統更新 </span></v-expansion-panel-header>
        <v-expansion-panel-content>
          <p> </p>
          <p> * 2/4: Twilio account upgraded <br />
            can now send SMS messages to any US numbers </p>
          <p> * 2/3: SMS text notification implemented <br />
            if phone number is provided: <br />
            owner will be notified when 1) new offer made, <br />
            user will be notified when 2) award of bids </p>
          <p> * 2/2: email notification implemented <br />
            if email is provided: <br />
            owner will be notified when 1) new offer made, <br />
            user will be notified when 2) award of bids </p>
          <p> * 1/31 Talked with Julio Yound & David Pi: <br /> 
            raised shipping to 20%, consideration of bulky items, heavy items, etc </p>
          <p> * 1/28 dry run of first draft <br />
            ideas shared with Bill: pm, avatar not showing, content screening, 404, award of bid </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header> <span class="text-h6 deep-orange--text">
          <v-icon class="mr-2 deep-orange--text"> mdi-account-group-outline</v-icon> 開發團隊 </span></v-expansion-panel-header>
        <v-expansion-panel-content>
          Some content
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  data: () => ({
    panel: [0,1,2],
  }),
  mounted(){
   this.$store.dispatch('removeAllBackButtons')
  },
  methods: {
    viewDetail (item, index) {
      console.log(item, index)
      this.$router.push('/itemDetails')
    }
  }
}
</script>
