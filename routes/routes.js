const express = require("express");
const router = express.Router();
const RekognitionServiceController = require("../controllers/RekognitionServiceController")
const S3ServiceController = require("../controllers/S3ServiceController")
const uploadImage = require("../config/multer")


router.get('/checkin', uploadImage, RekognitionServiceController.compareFaces);
router.post('/addFaceToIndex', uploadImage, RekognitionServiceController.addProfilePicture );
router.get('/analyze',uploadImage, RekognitionServiceController.analyzeFace);
//s3
router.post('/upload', S3ServiceController.uploadSinglePicture)

module.exports = router;