<template>
  <v-app >
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list>

        <v-list-item v-if="$store.state.avatar!=''">
          <v-list-item-content>
            <v-list-item-title>
              <!-- {{ $store.state.avatar }} -->
              <v-img height="40" width="40"
                :src="$store.state.avatar" />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/">
          <v-list-item-action>
            <v-icon class="brown--text">mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 主頁 </span> 
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/account">
          <v-list-item-action>
            <v-icon class="purple--text">mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 帳戶設定 </span></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/listview">
          <v-list-item-action>
            <v-icon class="pink--text">mdi-format-list-numbered</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 上架貨品 </span> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/upload">
          <v-list-item-action>
            <v-icon class="deep-orange--text">mdi-upload</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 物品上傳 </span> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="$store.state.winningbidsCount>0" nuxt to="/winning">
          <v-list-item-action>
            <v-icon class="light-green--text">mdi-cart-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 購買物品 </span> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/total">
          <v-list-item-action>
            <v-icon class="cyan--text">mdi-currency-usd</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 奉獻累計 </span> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt to="/announce">
          <v-list-item-action>
            <v-icon class="indigo--text">mdi-newspaper-variant-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> <span class="charlg"> 消息發佈 </span> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
<hr>        
        <v-list-item nuxt to="/admin" v-if="membership=='admin'">
          <v-list-item-action>
            <v-icon class="pink--text">mdi-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> 
              <!-- <v-badge v-if="waitlist>0" color="green" :content="waitlist"> -->
                <span class="charlg pink--text"> 內容審核 </span> 
                <v-chip v-if="waitlist>0" text-color="white"
                  color="green" small >
                  {{waitlist}}
                </v-chip>
              <!-- </v-badge> -->
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="indigo" dark fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="registered" /> -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
        <v-btn v-if="$store.state.backtoViewlist" icon 
            @click="$router.push('/listview'); 
            $store.dispatch('setBacktoList', false);">
          <v-icon>mdi-keyboard-backspace</v-icon> 
        </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <v-layout>
        <!-- <v-layout justify-center align-center> -->
          <v-flex>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null
    }
  },
  computed: {
    registered(){
      return this.$store.state.registered
    },
    membership(){
      return this.$store.state.membership
    },
    waitlist(){
      return this.$store.state.waitlistCount
    }
  }
}
</script>

<style scoped>
.charlg {
  font-size: 24px;
  font-family: SimSum;
}
</style>
