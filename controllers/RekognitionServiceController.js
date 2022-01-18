const RekognitionService = require("../services/RekognitionService");
const CaptureImageService = require("../services/CaptureImageService");
const fs = require("fs")

const captureImageService = new CaptureImageService
const rekognitionService = new RekognitionService

class FacialAnalyzeController {

    async createNewCollection(req,res){
        const { collectionName } = req.body

        const newCollection = await rekognitionService.createNewCollection(collectionName);

        if (err){
            throw err;
        } 
    
        res.send(req.body.collectionName)

    }

    async addProfilePicture(req, res) {
        const image = req.file;

        const fileResult = fs.readFile(image, function (err, data) {
        if (err) throw err;
     
            const file = data;

        }) 

        res.send(req.file.originalname)
    }
    

    async analyzeFace (req, res) {
        const image = req.file;

        const result = fs.readFile(image, function (err, data) {
            if (err) throw err;
            
                const file = data;

                const analyzeFace = rekognitionService.detectFace(file);
            })
        res.send(result);
    }

    async compareFaces(req, res) {
        const image = req.file
    
        const fileResult = fs.readFile(image, function (err, data) {
        if (err) throw err;
     
            const file = data;

         const analyzeResult = rekognitionService.compareFaces(file);
         res.send(analyzeResult)
        })
    }

}


module.exports = new FacialAnalyzeController()