const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');
const cp = require('child_process');
const spawn = require('await-spawn');
const cors = require('cors')
const ffmpeg = require('ffmpeg-static')
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config()

const port = process.env.PORT
app.use(express.static('public'))
app.use(cors())
app.use(express.static(__dirname + '/PublicBuild/'))
app.use(bodyParser.urlencoded({extended: false}))

app.listen(port,() => {
    console.log(`Example app listening at Port: ${port}`)
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + 'Public/index.html')
})


app.get('/download', async (req, res) =>{
    link = req.query.url
    startTime = req.query.startTime
    duration = req.query.duration
    format = parseInt(req.query.format)
    format = format== 0 ? 'mp4' : 'mp3'
    quality = req.query.quality
    
    console.log(startTime, duration)

    videoInfo = await ytdl.getInfo(link)


    seperateStreams = false // audio and video are sperate
    videUrl = ''
    audioUrl = ''
    // check if video quality is in downloadable non-adaptive qualities (<720p)
    let formats = videoInfo.player_response.streamingData.formats
    let adaptiveFormats = videoInfo.player_response.streamingData.adaptiveFormats

    if(formats.some(vid => vid.quality == quality)){
        videoUrl = formats.find(obj => {
            return obj.quality === quality
        }).url
    }else if(adaptiveFormats.some(vid => vid.quality == quality)){
        videoUrl = adaptiveFormats.find(obj => {
            return obj.quality === quality && !obj.mimeType.includes("webm")
        }).url
        audioUrl = videoInfo.player_response.streamingData.adaptiveFormats[videoInfo.player_response.streamingData.adaptiveFormats.length - 3].url
        seperateStreams = true
    }else{
        res.status(400)
        return
    }

    console.log(seperateStreams)

//     title = videoInfo.videoDetails.title.replace(/\s/g, '_');


    title = "video" + Math.floor(Math.random() * 1500).toString()
    fileName = `${title}-${startTime}-${startTime+duration}.${format}`
    
    res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")

    if(seperateStreams){
        const ffmpegProcess = await spawn(ffmpeg, [
            '-ss', startTime,
            '-t', duration,
            '-i', videoUrl,
            '-ss', startTime,
            '-t', duration,
            '-i', audioUrl,
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-pix_fmt', 'yuv420p',
            // '-vcodec', 'libx264',
            `${fileName}`,
        ])
    }else{
        const ffmpegProcess = await spawn(ffmpeg, [
            '-ss', startTime,
            '-t', duration,
            '-i', videoUrl,
            '-c', 'copy',
            '-pix_fmt', 'yuv420p',
            '-vcodec', 'libx264',
            `${fileName}`,
        ])
    }

    console.log('video output saved locally');
    
    // filePath = `./${fileName.split(/\ /).join('\ ')}`
    filePath = `./${fileName}`
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res).on('finish', () =>{
        
        fs.unlink(filePath, function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
       });  

    });

})


app.get('/info', async (req, res) => {
    console.log("info requested")
    videoData = await ytdl.getInfo(req.query.url)

    // videoData.player_response.streamingData.formats[-1].url
    
    res.send(videoData)

})
