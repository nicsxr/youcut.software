(function(t){function e(e){for(var i,a,s=e[0],l=e[1],u=e[2],d=0,p=[];d<s.length;d++)a=s[d],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&p.push(r[a][0]),r[a]=0;for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(t[i]=l[i]);c&&c(e);while(p.length)p.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],i=!0,s=1;s<n.length;s++){var l=n[s];0!==r[l]&&(i=!1)}i&&(o.splice(e--,1),t=a(a.s=n[0]))}return t}var i={},r={app:0},o=[];function a(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=i,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var c=l;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var i=n("85ec"),r=n.n(i);r.a},1:function(t,e){},"499d":function(t,e,n){},"4a9f":function(t,e,n){"use strict";var i=n("499d"),r=n.n(i);r.a},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"container-fluid"},[n("div",{},[n("h3",[t._v("Input link")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.url,expression:"url"}],staticClass:"display-4",staticStyle:{width:"90%","text-align":"center"},attrs:{type:"text",id:"videoUrl",placeholder:"Link of Youtube video"},domProps:{value:t.url},on:{input:function(e){e.target.composing||(t.url=e.target.value)}}})]),n("button",{staticClass:"btn btn-danger mt-3 mb-3",on:{click:function(e){return t.checkVideo()}}},[t._v("Check Video")])]),n(t.component,{tag:"component",attrs:{vidId:t.videoId,vidUrl:t.url}})],1)},o=[],a=(n("ac1f"),n("466d"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hello"},[n("h1",[t._v(t._s(t.title))]),n("div",{staticStyle:{display:"inline-block"}},[n("youtube",{ref:"youtube",attrs:{"video-id":t.videoId},on:{playing:t.playing}})],1),n("div",{staticClass:"ml-3",staticStyle:{display:"inline-block"}},[n("button",{staticClass:"btn btn-primary mr-1 mb-2",on:{click:t.deductSecond}},[t._v("-")]),n("input",{staticStyle:{height:"35px",width:"150px","text-align":"center","font-size":"25px"},attrs:{type:"text"},domProps:{value:t.currentTime},on:{input:function(e){t.currentTime=e.target.value}}}),n("button",{staticClass:"btn btn-primary ml-1 mb-2",on:{click:t.addSecond}},[t._v("+")]),n("h1",[t._v("Start / End")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.startTime,expression:"startTime"}],staticStyle:{height:"35px",width:"150px","text-align":"center","font-size":"25px"},attrs:{type:"text"},domProps:{value:t.startTime},on:{input:function(e){e.target.composing||(t.startTime=e.target.value)}}}),n("input",{directives:[{name:"model",rawName:"v-model",value:t.endTime,expression:"endTime"}],staticStyle:{height:"35px",width:"150px","text-align":"center","font-size":"25px"},attrs:{type:"text"},domProps:{value:t.endTime},on:{input:function(e){e.target.composing||(t.endTime=e.target.value)}}}),n("br"),n("br"),n("button",{staticClass:"btn btn-lg btn-primary mr-5",on:{click:t.pressStartTime}},[t._v("Start")]),n("button",{staticClass:"btn btn-lg btn-primary ml-5",on:{click:t.pressStopTime}},[t._v("Stop")]),n("br"),n("br"),n("button",{staticClass:"btn btn-md btn-warning",on:{click:t.playVideo}},[t._v("Play result")]),n("br"),t._v(" "),n("br"),n("button",{staticClass:"btn btn-lg btn-success",on:{click:t.download}},[t._v("D O W N L O A D")]),t._v(" "),n("br"),n("br")])])}),s=[],l=(n("99af"),n("b680"),n("d3b7"),n("25f0"),{name:"HelloWorld",props:{vidId:String,vidUrl:String},created:function(){var t=this;this.$http.get("https://noembed.com/embed?url=".concat(this.vidUrl)).then((function(e){return t.title=e.body.title.toString()}))},data:function(){return{videoId:this.vidId,currentTime:0,isPlaying:!1,startTime:0,endTime:0,title:""}},methods:{playVideo:function(){var t=this;if(parseFloat(this.startTime)>0){this.player.seekTo(this.startTime),this.player.playVideo();var e=(1e3*(parseFloat(this.endTime)-parseFloat(this.startTime))).toFixed(1);setTimeout((function(){t.pauseVideo()}),e)}},pauseVideo:function(){this.player.pauseVideo()},playing:function(){var t=this;this.timeId=setInterval((function(){t.player.getCurrentTime().then((function(e){t.currentTime=e.toFixed(1)})),t.isPlaying}),100)},addSecond:function(){this.currentTime=(parseFloat(this.currentTime)+.1).toFixed(1),this.player.seekTo(this.currentTime)},deductSecond:function(){this.currentTime=(parseFloat(this.currentTime)-.1).toFixed(1),this.player.seekTo(this.currentTime)},pressStartTime:function(){var t=this;this.player.getCurrentTime().then((function(e){t.startTime=e.toFixed(1)}))},pressStopTime:function(){var t=this;this.player.getCurrentTime().then((function(e){t.endTime=e.toFixed(1)}))},download:function(){var t=parseFloat(this.endTime)-parseFloat(this.startTime);window.location.href="http://".concat("youcut.software","/download?url=").concat(this.vidUrl,"&startTime=").concat(this.startTime,"&duration=").concat(t,"&title=").concat(this.title)},youtubStateChange:function(t){1==t.data?(console.log("playing"),this.isPlaying=!0):2==t.data&&(console.log("stopped"),this.isPlaying=!1,clearInterval(this.timeId))}},computed:{player:function(){return this.$refs.youtube.player}},mounted:function(){this.player.addEventListener("onStateChange",this.youtubStateChange)}}),u=l,c=(n("4a9f"),n("2877")),d=Object(c["a"])(u,a,s,!1,null,"5816014e",null),p=d.exports,m={name:"App",components:{HelloWorld:p},data:function(){return{url:"",videoId:"",component:null}},methods:{checkVideo:function(){var t=this;this.component=null,this.videoId=this.parseVideoId(this.url),setTimeout((function(){t.component=p}),10)},sleep:function(t){var e=(new Date).getTime(),n=e;while(n<e+t)n=(new Date).getTime()},parseVideoId:function(t){var e=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,n=t.match(e);return!(!n||11!=n[7].length)&&n[7]}}},f=m,h=(n("034f"),Object(c["a"])(f,r,o,!1,null,null,null)),v=h.exports,b=n("5f5b"),y=n("b1e0"),g=n("e0ec"),T=n.n(g),x=n("28dd");n("f9e3"),n("2dd8");i["default"].config.productionTip=!1,i["default"].use(b["a"]),i["default"].use(y["a"]),i["default"].use(T.a),i["default"].use(x["a"]),new i["default"]({render:function(t){return t(v)}}).$mount("#app")},"85ec":function(t,e,n){}});
//# sourceMappingURL=app.50123e84.js.map