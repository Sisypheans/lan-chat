<template>
  <div id="app" @click="m_show(false)">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mycard from "@/components/mycard/mycard";
import { mapActions } from "vuex";
export default {
  components: {
    mycard,
  },
  created() {
    this.$store.dispatch("initData");
  },
  methods: {
    ...mapActions(["m_show"]),
  },
};
</script>

<style lang="css">
  #app {
    display: flex;
    border-radius: 50px;
    height :100%;
    margin: 20px auto;
    background-color: #fff;
  }

  .main {
    flex: 1;
    background: #f2f2f2;
  }

  html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  ul, li {
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  p {
    margin: 0px;
    padding: 0px;
  }
</style>

