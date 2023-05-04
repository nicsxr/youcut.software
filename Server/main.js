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
    format = format== 0 ? 'mp4' : 'mp4'
    console.log(startTime)
    //res.setHeader(`Content-Disposition`,`attachment; filename=${title}-${startTime}-${startTime+duration}.mp4`).on('error', (err) => console.log(err))
    
    console.log(startTime, duration)
    videoInfo = await ytdl.getInfo(link)
    title = videoInfo.videoDetails.title.replace(/\s/g, '_');
    fileName = `${title}-${startTime}-${startTime+duration}.${format}`
    
    res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")

    const ffmpegProcess = await spawn(ffmpeg, [
        '-ss', startTime,
        '-i', videoInfo.player_response.streamingData.formats[videoInfo.player_response.streamingData.formats.length-1].url,
        '-t', duration,
        '-c', 'copy',
        '-pix_fmt', 'yuv420p',
        '-vcodec', 'libx264',
        `${fileName}`,
    ])


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
