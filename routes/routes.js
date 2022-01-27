const express = require("express");
const router = express.Router();
const RekognitionController = require("../controllers/RekognitionController")
//const S3ServiceController = require("../controllers/S3ServiceController")
const uploadImage = require("../config/multer")


router.get('/create', uploadImage, RekognitionController.createNewCollection);
router.post('/analyze', uploadImage, RekognitionController.analyzeText );
//s3
//router.post('/upload', S3ServiceController.uploadSinglePicture)

module.exports = router;