const RekognitionService = require("../services/RekognitionService");
const CaptureImageService = require("../services/CaptureImageService");
const fs = require("fs")

const captureImageService = new CaptureImageService
const rekognitionService = new RekognitionService

class AnalyzeTextController {

    async createNewCollection(req,res){
        const { collectionName } = req.body

        const newCollection = await rekognitionService.createNewCollection(collectionName);

        if (err){
            throw err;
        } 
    
        res.send(req.body.collectionName)

    }



    async analyzeText (req, res) {
        const image = await captureImageService.captureCamera()

        const result = fs.readFile("testpicture.png", function (err, data) {
            if (err) throw err;
            
                const file = data;

                const analyzedText = await rekognitionService.detectText(file);
            })
        res.send(result);
    }


}


module.exports = new AnalyzeTextController()