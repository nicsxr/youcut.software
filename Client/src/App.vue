<template>
  <div id="app">
    <div class="container-fluid">
      <div>
        <h3>Input link</h3>
        <input v-model="url" type="text" id="videoUrl" style="width: 90%; text-align: center;" class="display-4" placeholder="Link of Youtube video" >
      </div>  
      <button v-on:click="checkVideo()" class="btn btn-danger mt-3 mb-3">Check Video</button>
    </div>
    
    <component v-bind:is="component" :vidId="videoId" :vidUrl="url"></component>
  </div>
</template>

<script>
import VideoEditor from './components/VideoEditor.vue'

export default {
  name: 'App',
  components: {
    VideoEditor,
  },

  data: function(){
    return {
      url: "",
      videoId: "",
      component: null
    }
  },

  methods: {
    checkVideo: function(){
      this.component = null
      this.videoId = this.parseVideoId(this.url)
      setTimeout(() => {this.component = VideoEditor}, 10);
    },
    parseVideoId: function(url){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : "No video";
    }
  }
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
