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
    console.log(`Example app listening at Port: ${port}`)
})


app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/download', (req, res) =>{
    link = req.query.url
    startTime = parseFloat(req.query.startTime)
    duration = parseFloat(req.query.duration)
    console.log(startTime)
    res.header('Content-Disposition',  'attachment; filename="video.mp4')
    ffmpeg().input(ytdl(link, {
                        format: 'mp4',
                    })).on('Error', (err) => console.log(err))
                    //OUTPUT STREAM OPTIONS
                    .seekInput(startTime)
                    .duration(duration)
                    .videoCodec('libx264')
                    .format('mp4')
                    .on('error', (err) => console.log(err))
                    .pipe(res);
})