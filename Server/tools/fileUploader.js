const fs = require('fs');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require('aws-sdk');


/* Upload file */
function uploadFile(id, format){
    const FILE_NAME = `${id}.${format}`
    const FILE_PATH = `./temp_storage/${FILE_NAME}`
    let space = new AWS.S3({
        //Get the endpoint from the DO website for your space
        endpoint: process.env.S3_ENDPOINT,
        useAccelerateEndpoint: false,
        //Create a credential using DO Spaces API key (https://cloud.digitalocean.com/account/api/tokens)
        credentials: new AWS.Credentials(process.env.S3_ACCESS_KEY, process.env.S3_SECRET_KEY, null)
    });
    //Name of your bucket here
    const BucketName = process.env.S3_SPACE_NAME;
    const file = fs.readFileSync(FILE_PATH);
    let uploadParameters = {
      Bucket: BucketName,
    //   ContentType: req.query.content_type,
      Body: file,
      ACL: 'public-read',
      Key: FILE_NAME
    };
  
    return new Promise((resolve, reject) => {
        space.upload(uploadParameters, function (error, data) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('UPLOAD SUCCESS');

                fs.unlink(FILE_PATH, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });

                resolve(data);
            }
        });
    });
}



// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const fs = require('fs');

// const s3 = new aws.S3({ endpoint: "https://fra1.digitaloceanspaces.com",
//     useAccelerateEndpoint: false,
//     credentials: new aws.Credentials(process.env.S3_ACCESS_KEY, process.env.S3_SECRET_KEY, null)});
//     // accessKeyId: process.env.S3_ACCESS_KEY,
//     // secretAccessKey: process.env.S3_SECRET_KEY });


// function uploadFile(filename){
//     const file = fs.readFileSync(`${filename}`);
//     s3.putObject({ Bucket: process.env.S3_SPACE_NAME, Key: `${filename}`, Body: file, ACL: "public" }, (err, data) => {
//         if (err) return console.log(err);
//         console.log("Your file has been uploaded successfully!", data);
//     });
// }

module.exports = {
    uploadFile
}