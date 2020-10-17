const express = require('express')
const app = express()
const fs = require('fs');
const ytdl = require('ytdl-core');
const cors = require('cors')
const ffmpeg = require('fluent-ffmpeg')
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config()

const port = process.env.PORT
app.use(express.static('public'))
app.use(cors())
app.use(express.static(__dirname + '/Public/'))
app.use(bodyParser.urlencoded({extended: false}))

app.listen(port,() => {
    console.log(`Example app listening at Port: ${port}`)
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + 'Public/index.html')
})


app.get('/download', (req, res) =>{
    link = req.query.url
    startTime = parseFloat(req.query.startTime)
    duration = parseFloat(req.query.duration)
    title = encodeURI(req.query.title)
    console.log(startTime)
    //res.setHeader(`Content-Disposition`,`attachment; filename=${title}-${startTime}-${startTime+duration}.mp4`).on('error', (err) => console.log(err))
    fileName = `${title}-${startTime}-${startTime+duration}.mp4`
    res.header('Content-Disposition', "attachment; filename=\""+fileName+"\"")
    ffmpeg().input(ytdl(link, {
                        format: 'mp4',
                    })).on('Error', (err) => console.log(err))
                    //OUTPUT STREAM OPTIONS
                    .videoCodec('libx264')
                    .setStartTime(startTime)
                    .duration(duration)
                    .format('avi')
                    .on('error', (err) => console.log(err))
                    .pipe(res);
})