const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');
const spawn = require('await-spawn');
const cors = require('cors')
const ffmpeg = require('ffmpeg-static')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { uploadFile } = require('./tools/fileUploader');
const { QueueManagemer } = require('./queue/queueManagement');
const { getMediaOptions } = require('./tools/ffmpegOptions');
const { getVideoOptions } = require('./tools/videoOptions');
require('dotenv').config()

const port = process.env.PORT
app.use(express.static('public'))
app.use(cors())
app.use(express.static(__dirname + '/PublicBuild/'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


global.queue = new QueueManagemer()

app.listen(port,async () => {
    console.log(`Example app listening at Port: ${port}`)

    await spawn('ffmpeg', ['-version']).then(() =>{
        console.log("ffmpeg ready")
    }).catch((err) =>{
        console.log(err.stderr.toString())
    })
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + 'Public/index.html')
})


app.post('/download', async (req, res, next) =>{
    let link = req.body.url
    let startTime = req.body.startTime
    let duration = req.body.duration
    let format = parseInt(req.body.format)
    format = format== 0 ? 'mp4' : 'mp3'
    let quality = req.body.quality
    
    console.log(startTime, duration, link, format, quality)

    let ytVideoInfo = await ytdl.getInfo(link).catch((err) => next(err))

    let videoOptions = getVideoOptions(ytVideoInfo, quality)

    if (videoOptions.videoUrl == undefined || videoOptions.audioUrl == undefined || videoOptions.seperateStreams == undefined){
        res.status(400).send()
        return
    }

    // title = "video" + Math.floor(Math.random() * 1500).toString()
    // fileName = `${title}-${startTime}-${startTime+duration}.${format}`
    let video_id = uuidv4()
    fileName = `${video_id}.${format}`
    
    // res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")


    queue.addTask(video_id, format)

    let mediaOptions = getMediaOptions(videoOptions.seperateStreams, startTime, duration, videoOptions.videoUrl, videoOptions.audioUrl, fileName)

    console.log(mediaOptions, videoOptions)
    console.log("processing started - " + Date.now())

    const ffmpegProcess = spawn('ffmpeg', mediaOptions).then(() => {
        uploadFile(video_id, format)
        console.log("processing FINISH - " + Date.now())

    }).catch((err) => {
        console.log(err.stderr.toString())
        queue.updateTask(video_id, -1)
        console.log("processing FINISH - " + Date.now())
        next(err)
    })

    res.json({id: video_id})
})

app.get('/checkstatus', async (req, res, next) => {
    id = req.query.id
    task = await queue.getTask(id).catch((err) => next(err))

    res.json(task)
})

app.get('/info', async (req, res, next) => {
    console.log("info requested")
    videoData = await ytdl.getInfo(req.query.url).catch((err) => next(err))
    
    res.send(videoData)

})


app.use((err, req, res, next) => {
    console.error(err.stack)
    if(err) {
        res.status(500).send(err)
     }
     res.status(404).send('not found');
})