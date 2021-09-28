<template>
  <div class="content">
    <div class="msglist">
      <search></search>
      <chatlist></chatlist>
    </div>
    <div class="chatbox">
      <message></message>
      <v-text></v-text>
    </div>
  </div>
</template>

<script>
import search from '@/components/search/search'
import chatlist from '@/components/chatlist/chatlist'
import message from '@/components/message/message'
import vText from '@/components/text/text'
import { ipcRenderer,shell } from "electron";
export default {
  components: {
    search,
    chatlist,
    message,
    vText
  },
  created() {
    ipcRenderer.invoke("statr-server").then((res) => {
        if (res) {
          this.$message({
            type: "success",
            message: res,
          });
        }
      });
  },
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  height : 100%
  .msglist
    width: 250px
    background: rgb(230,230,230)
  .chatbox
    flex: 1
    height: 100%
</style>
