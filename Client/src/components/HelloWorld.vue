<template>
  <div class="hello">
    <h1>{{title}}</h1>
    <div style="display: inline-block;">
      <youtube :video-id="videoId" ref="youtube" @playing="playing"></youtube>  
    </div>
    <div style="display: inline-block;" class="ml-3">
      <button class="btn btn-primary mr-1 mb-2" @click="deductSecond">-</button>
      <input style="height:35px; width:150px; text-align:center; font-size:25px;" type="text" :value="currentTime"   v-on:input="currentTime = $event.target.value">
      <button class="btn btn-primary ml-1 mb-2" @click="addSecond">+</button>
      <h1>Start  /  End</h1>
      <input style="height:35px; width:150px; text-align:center; font-size:25px;" type="text" v-model="startTime">
      <input style="height:35px; width:150px; text-align:center; font-size:25px;" type="text" v-model="endTime">
      <br><br>
      <button class="btn btn-lg btn-primary mr-5" @click="pressStartTime">Start</button>
      <button class="btn btn-lg btn-primary ml-5" @click="pressStopTime">Stop</button>    

      <br><br>
      <button class="btn btn-md btn-warning" @click="playVideo">Play result</button>
      <br> <br>
      <button class="btn btn-lg btn-success" @click="download">D O W N L O A D</button> <br><br>
    </div>
  </div>
</template>

<script>
var timer
export default {
  name: 'HelloWorld',
  props: {
    vidId: String,
    vidUrl: String
  },
  created(){
    this.$http.get(`https://noembed.com/embed?url=${this.vidUrl}`).then((data)=> this.title = (data.body.title).toString())
  },
  data() {
    return {
      videoId: this.vidId,
      currentTime: 0,
      isPlaying: false,

      startTime: 0,
      endTime: 0,

      title: "",
    }
  },
  methods: {
    playVideo() {
      clearTimeout(timer)
      if(parseFloat(this.startTime) > 0){
        this.player.seekTo(this.startTime)
        this.player.playVideo()
        var timeOut = ((parseFloat(this.endTime).toFixed(1) - parseFloat(this.startTime).toFixed(1) + 0.1 ) * 1000)
        timer = setTimeout(() => {
          this.pauseVideo()}
          , timeOut)
      }
    },
    pauseVideo(){
      this.player.pauseVideo()
    },
		playing() {
      this.timeId = setInterval(() => {
        this.player.getCurrentTime().then((time) => {
          this.currentTime = time.toFixed(1)
        });
        if(!this.isPlaying){
          return
        }
      }, 100);
    },
    addSecond(){
      this.currentTime = (parseFloat(this.currentTime) + 0.1).toFixed(1)
      this.player.seekTo(this.currentTime)
    },
    deductSecond(){
      this.currentTime = (parseFloat(this.currentTime) - 0.1).toFixed(1)
      this.player.seekTo(this.currentTime)
    },

    pressStartTime(){
      this.player.getCurrentTime().then((time) => {
						this.startTime = time.toFixed(1)
          });
    },
    pressStopTime(){
      this.player.getCurrentTime().then((time) => {
						this.endTime = time.toFixed(1)
          });
    },

    download(){
      var duration = parseFloat(this.endTime) - parseFloat(this.startTime)
      window.location.href = `http://${process.env.VUE_APP_HOST}/download?url=${this.vidUrl}&startTime=${this.startTime}&duration=${duration}&title=${this.title}`
    },

    youtubStateChange (youtubeState) {
        if(youtubeState.data == 1){
          console.log('playing')
          this.isPlaying = true
        }else if(youtubeState.data == 2){
          console.log('stopped')
          this.isPlaying = false
          clearInterval(this.timeId)
        }
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player
    }
  },
  mounted () {
    this.player.addEventListener('onStateChange', this.youtubStateChange)
},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
