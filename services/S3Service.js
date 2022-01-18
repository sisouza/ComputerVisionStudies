const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
require("dotenv").config();

const { AWS_REGION, BUCKET_NAME } = process.env;


const s3 = new aws.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey:AWS_SECRET_ACCESS_KEY,
      bucket: BUCKET_NAME
})

    
class S3Service {

    addFile(file) {
        const params = {
        s3: s3,
        body: file.data,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
           crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err)

            const filename = `${hash.toString("hex")}-${file.originalname}`
             cb(null, filename)
           })
         },
         fileFilter: (req, file, cb) => {
         const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error("invalid file type."));
         }
        }
      }
 
    const result = s3.upload(params, (err, data) => err == null ? resolve(data) : reject(err));
    return {url: result.location };
 }

    



}


module.exports = S3Service;