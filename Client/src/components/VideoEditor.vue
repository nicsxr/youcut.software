<template>
<div class="hello">
   <h1>{{title}}</h1>
   <div class="container" v-show="videoFound">
      <div class="row">
         <div class="col-sm">
            <div class="" style="">
               <youtube fitParent :video-id="videoId" ref="youtube" @playing="playing"></youtube>
            </div>
         </div>
         <div class="col-sm">
            <div>
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
                  <br><br>

                  <!-- quality selector -->
                  <h2>Select quality</h2>
                  <div>
                    <b-form-select v-model="selectedQuality" :options="availableQualities" class="mb-3">
                      <!-- This slot appears above the options from 'options' prop -->
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
                      </template>
                    </b-form-select>
                    {{selectedQuality}}
                  </div>

                  <!-- format selector -->
                  <h2>Select format</h2>
                  <div>
                    <b-form-select v-model="selectedFormat" :options="availableFormats" class="mb-3">
                    </b-form-select>
                    <div class="mt-3">Selected format: <strong>{{ selectedFormat }}</strong></div>
                  </div>

                  <!-- formats -->
                  <b-dropdown variant="success" class="m-2 w-100" block @click="download(0)" right split text="Download">
                  </b-dropdown><br> 
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
</template>

<script>
var timer
export default {
  name: 'VideoEditor',
  props: {
    vidId: String,
    vidUrl: String
  },
  created(){
    this.$http.get(`https://noembed.com/embed?url=${this.vidUrl}`).then((data)=>{
      //check if video exists
      if(data.body.error || !this.vidUrl){
        this.title = "Video not found"
        this.videoFound = false
      }else{
        this.videoFound = true
        this.title = (data.body.title).toString()
      }
    })
  },
  data() {
    return {
      videoFound: false,
      videoId: this.vidId,
      currentTime: 0,
      isPlaying: false,

      startTime: 0,
      endTime: 0,

      title: "",
      availableQualities: [],
      selectedQuality: undefined,

      availableFormats: [
        {value: "mp4", text: "Video MP4"},
        {value: "mp3", text: "Audio MP3"},
        // {value: "gif", text: "GIF (30 seconds max)"},
      ],
      selectedFormat: "mp4",
    }
  },
  methods: {
    playVideo() {
      this.player.playVideo()
      this.player.seekTo(this.startTime)
      this.currentTime = this.startTime
      clearInterval(timer)
      if(parseFloat(this.startTime) > 0){
        timer = setInterval(() => {
          if(parseFloat(this.currentTime) >= parseFloat(this.endTime)){
            console.log('current: '+parseFloat(this.currentTime)  +typeof(this.currentTime)+'endtime'+ this.endTime)
            this.pauseVideo()
            clearInterval(timer)
          }
        }, 50);
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

    download(format){  // 0=mp4 1=mp3 2=gif(wip)
      var duration = parseFloat(this.endTime) - parseFloat(this.startTime)
      console.log(this.selectedQuality)
      if(this.selectedQuality != undefined)
        window.location.href = `${process.env.VUE_APP_HOST}/download?url=${this.vidUrl}&startTime=${this.startTime}&duration=${duration.toFixed(1)}&title=${this.title}&format=${format}&quality=${this.selectedQuality}`
    },

    async getAvailableQualities() {
      this.availableQualities = this.formatQualities(await this.player.getAvailableQualityLevels())
    },
    
    async youtubStateChange (youtubeState) {
      if(youtubeState.data == 1){
          console.log('playing')
          this.isPlaying = true
        }else if(youtubeState.data == 2){
          console.log('stopped')
          this.isPlaying = false
          clearInterval(this.timeId)
        }
        if(this.availableQualities.length == 0) 
          this.getAvailableQualities()
    },
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
.hello{
  width: 100%;
}
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
.player {
  max-height: 100%;
  max-width: 100%;
}
</style>
