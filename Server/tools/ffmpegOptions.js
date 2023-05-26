function getMediaOptions(seperateStreams){
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
}

module.exports = {
    getMediaOptions
}