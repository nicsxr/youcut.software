const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');
const { spawn } = require('child_process');
const cors = require('cors')
const ffmpeg = require('ffmpeg-static')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { uploadFile } = require('./tools/fileUploader');
const { QueueManagemer } = require('./queue/queueManagement')
require('dotenv').config()

const port = process.env.PORT
app.use(express.static('public'))
app.use(cors())
app.use(express.static(__dirname + '/PublicBuild/'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

global.queue = new QueueManagemer()

app.listen(port,() => {
    console.log(`Example app listening at Port: ${port}`)
    console.log(process.env.S3_ACCESS_KEY)
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + 'Public/index.html')
})


app.post('/download', async (req, res) =>{
    link = req.body.url
    startTime = req.body.startTime
    duration = req.body.duration
    format = parseInt(req.body.format)
    format = format== 0 ? 'mp4' : 'mp3'
    quality = req.body.quality
    
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

    // title = "video" + Math.floor(Math.random() * 1500).toString()
    // fileName = `${title}-${startTime}-${startTime+duration}.${format}`
    video_id = uuidv4()
    fileName = `${video_id}.${format}`
    
    // res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")


    if(seperateStreams){
        const ffmpegProcess = spawn('ffmpeg', [
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
            `./temp_storage/${fileName}`,
        ]).on('close', (code) => {
            uploadFile(video_id, format)
            queue.addTask(video_id, format)

            res.json({id: video_id, statusCode: code})
        })
        // .then(() => {
        //     uploadFile(video_id, format)

        //     queue.addTask(video_id, format)
        //     res.json({id: video_id})
        // }).catch((err) => {
        //     console.log(err)
        //     res.send(err)
        // })
    }else{
        const ffmpegProcess = spawn('ffmpeg', [
            '-ss', startTime,
            '-t', duration,
            '-i', videoUrl,
            '-c', 'copy',
            '-pix_fmt', 'yuv420p',
            '-vcodec', 'libx264',
            `./temp_storage/${fileName}`,
        ]).on('close', (code) => {
            uploadFile(video_id, format)
            queue.addTask(video_id, format)

            res.json({id: video_id, statusCode: code})
        })
        // .then(() => {
        //     uploadFile(video_id, format)
        //     queue.addTask(video_id, format)

        //     res.json({id: video_id})
        // }).catch((err) =>{
        //     console.log(err)
        //     res.status(500).end()
        // })
    }
})

app.get('/checkstatus', async (req, res) => {
    id = req.query.id
    task = await queue.getTask(id)

    res.json(task)
})

app.get('/info', async (req, res) => {
    console.log("info requested")
    videoData = await ytdl.getInfo(req.query.url)

    // videoData.player_response.streamingData.formats[-1].url
    
    res.send(videoData)

})
