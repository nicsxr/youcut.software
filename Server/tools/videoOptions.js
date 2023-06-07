function getVideoOptions(ytdlInfo, desiredQuality){
    let seperateStreams = undefined // audio and video are sperate
    let videoUrl = undefined
    let audioUrl = undefined
    
    // check if video quality is in downloadable non-adaptive qualities (<720p)
    let formats = ytdlInfo.player_response.streamingData.formats
    let adaptiveFormats = ytdlInfo.player_response.streamingData.adaptiveFormats

    if(formats.some(vid => vid.quality == desiredQuality)){
        videoUrl = formats.find(obj => {
            seperateStreams = false
            return obj.quality === desiredQuality
        }).url
    }else if(adaptiveFormats.some(vid => vid.quality == desiredQuality)){
        videoUrl = adaptiveFormats.find(obj => {
            return obj.quality === desiredQuality && !obj.mimeType.includes("webm")
        }).url
        audioUrl = ytdlInfo.player_response.streamingData.adaptiveFormats[ytdlInfo.player_response.streamingData.adaptiveFormats.length - 3].url
        seperateStreams = true
    }

    return {
        videoUrl,
        audioUrl,
        seperateStreams
    }
}

module.exports = {
    getVideoOptions
}