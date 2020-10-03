const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');
const cors = require('cors')
const ffmpeg = require('fluent-ffmpeg')
const bodyParser = require('body-parser');
const e = require('express');

const port = 8000
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

app.listen(port,() => {
    console.log(`Example app listening at http://localhost:${port}`)
})


app.get('/', (req, res) => {
    download()
    res.sendFile('index.html')
})

app.get('/download', (req, res) =>{
    link = req.query.url
    startTime = req.query.startTime
    duration = req.query.duration
    console.log(startTime)
    res.header('Content-Disposition',  'attachment; filename="video.avi')
    ffmpeg().input(ytdl(link, {
                        format: 'mp4',
                    })).on('Error', (err) => console.log(err))
                    //OUTPUT STREAM OPTIONS
                    .setStartTime(`00:00:${startTime}`)
                    .duration(duration)
                    .videoBitrate('4096k')
                    .format('avi')
                    .on('error', (err) => console.log(err))
                    .pipe(res);
})