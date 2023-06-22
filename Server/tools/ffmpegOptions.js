function getMediaOptions(seperateStreams, startTime, duration, videoUrl, audioUrl, format, fileName){
    if (format == 'mp4'){
        return seperateStreams ? 
        [
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
        ] : [
            '-ss', startTime,
            '-t', duration,
            '-i', videoUrl,
            '-c', 'copy',
            '-pix_fmt', 'yuv420p',
            '-vcodec', 'libx264',
            `./temp_storage/${fileName}`,
        ]
    } else if (format == 'mp3'){
        return [
            '-ss', startTime,
            '-t', duration,
            '-i', audioUrl,
            `./temp_storage/${fileName}`
        ]
    } else if (format == 'gif'){
        return [
            '-ss', startTime,
            '-t', duration,
            '-i', videoUrl,
            '-vf', "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
            '-loop', '0',
            `./temp_storage/${fileName}`
        ]
    }
}

module.exports = {
    getMediaOptions
}