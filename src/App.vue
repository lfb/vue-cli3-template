<template>
  <div id="app">
    <v-loading :text="loadingText" v-if="isLoading"/>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VLoading from './components/Loading'

export default {
  components: {
    VLoading
  },
  computed: {
    ...mapGetters('loading', [
      'isLoading',
      'loadingText'
    ])
  },
  created () {
    this.getArticle()
  },
  methods: {
    ...mapActions({
      getArticleList: 'articles/getArticleList'
    }),
    async getArticle () {
      await this.getArticleList()
    }
  }
}
</script>
<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
