const aws = require("aws-sdk");
require("dotenv").config();
const { AWS_REGION } = process.env;


const rekognition = new aws.Rekognition();

class RekognitionService {

    detectText(file) {
        const params = {
           CollectionId: "test",
           Image: {
           Bytes: file
           }
       };

       rekognition.detectText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {

            for (var i = 0; i < data.TextDetections.length; i++) {
               var result = {
              "detectedtext":data.TextDetections[i].DetectedText,
               "texttype": data.TextDetections[i].Type,
                "confidence": data.TextDetections[i].Confidence
                }
                console.log(result)
            }
            
        }
     });
    }


}


module.exports = RekognitionService;