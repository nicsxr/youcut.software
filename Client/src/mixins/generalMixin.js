// function formatQualities(qualities){
//     let formattedQualities = qualities.map(format => {
//         switch (format) {
//           case "tiny":
//             return {fomrmat: "144p"}
//           case "small":
//             return {fomrmat: "240p"}
//           case "medium":
//             return {fomrmat: "360"}
//           case "large":
//             return {fomrmat: "480p"}
//           case "hd720":
//             return {fomrmat: "720p"}
//           case "hd1080":
//             return {fomrmat: "1080p"}
//         //   case "hd1440": //
//         //     format = {fomrmat: "144p"}
//         //     break;
//           default:
//             return;
//         }
//       }).filter(format => format != undefined)

//       return formattedQualities
// }

// export default {
//     formatQualities
// }

import Vue from 'vue';

Vue.mixin({
    methods: {
        formatQualities(qualities){
            let formattedQualities = qualities.map(format => {
                switch (format) {
                  case "tiny":
                    return {text: "144p", value: "144p", format: format}
                  case "small":
                    return {text: "240p", value: "240p", format: format}
                  case "medium":
                    return {text: "360p", value: "360p", format: format}
                  case "large":
                    return {text: "480p", value: "480p", format: format}
                  case "hd720":
                    return {text: "720p", value: "720p", format: format}
                  case "hd1080":
                    return {text: "1080p", value: "1080p", format: format}
                //   case "hd1440": //
                //     format = {fomrmat: "144p"}
                //     break;
                  default:
                    return;
                }
              }).filter(format => format != undefined)
        
              return formattedQualities
        } 
    }
  })