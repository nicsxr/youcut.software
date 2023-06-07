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
const { Queue } = require('sql-queue')
const { getMediaOptions } = require('./tools/ffmpegOptions');
const { getVideoOptions } = require('./tools/videoOptions');
require('dotenv').config()

const port = process.env.PORT
app.use(express.static('public'))
app.use(cors())
app.use(express.static(__dirname + '/PublicBuild/'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


var queue = new Queue("./database/newdb.db", 'tasks', false)

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

    if (videoOptions.videoUrl == undefined || videoOptions.seperateStreams == undefined || (videoOptions.audioUrl == undefined && videoOptions.seperateStreams == true)){
        res.status(400).send()
        return
    }

    // title = "video" + Math.floor(Math.random() * 1500).toString()
    // fileName = `${title}-${startTime}-${startTime+duration}.${format}`
    let videoId = uuidv4()
    fileName = `${videoId}.${format}`
    
    // res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")

    let mediaOptions = getMediaOptions(videoOptions.seperateStreams, startTime, duration, videoOptions.videoUrl, videoOptions.audioUrl, fileName)

    await queue.add(async () => {
        await spawn('ffmpeg', mediaOptions)
        .catch((err) => {
            throw err
        })
        await uploadFile(videoId, format).catch((err) => {
            throw err
        })
    }, [], JSON.stringify({
        format: format,
        url: `https://${process.env.S3_SPACE_NAME}.${process.env.S3_ENDPOINT}/${fileName}`,
    }).replace(/\"/g, "'"), videoId)

    res.json({id: videoId})
})

app.get('/checkstatus', async (req, res, next) => {
    let id = req.query.id
    let task = await queue.getById(id).catch((err) => next(err))

    task.info = JSON.parse(task.info.replace(/'/g, "\""))

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