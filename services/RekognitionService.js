const aws = require("aws-sdk");
require("dotenv").config();
const { AWS_REGION } = process.env;


const rekognition = new aws.Rekognition();

class RekoService {

    createCollection(colectionName){
       const params = {
            CollectionId: colectionName
          };
        
          rekognition.createCollection(params, function(err, data) {
            if (err) {
              console.log(err, err.stack);
            } else {
              console.log(data);
            }
          });
    
    }

     addFaceToIndex(file) {
         const params = {
            CollectionId: "test",
            Image: {
            Bytes: file
            },
            DetectionAttributes: ["ALL"],
            ExternalImageId: file.originalname,
            MaxFaces: 1,
            QualityFilter: "AUTO"
        };
        
        rekognition.indexFaces(params, function(err, data) {
        if (err) {
        console.log(err, err.stack);
        } else {
        console.log(data);
            }
        });
    }


    detectFace(file) {

        var params = {
                Image: {
                    Bytes: file
                },
                Attributes: ["ALL"]
            };
            
        
        rekognition.detectFaces(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
              
                 for (var i = 0; i < data.FaceDetails.length; i++) {
                    var result = {
                        "age range low": data.FaceDetails[i].AgeRange.Low,
                        "age range high": data.FaceDetails[i].AgeRange.High,
                        "gender": data.FaceDetails[i].Gender.Value,
                        "emotion type": data.FaceDetails[i].Emotions[0].Type
                    }
                    console.log(result)
                }

            }
         })
        }

   
    compareFaces(file) {

         var params = {
            CollectionId: "users",
            Image: {
            Bytes: file
            },
            FaceMatchThreshold: 90,
            MaxFaces: 10
         };
        
        rekognition.searchFacesByImage(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
           
                for (var i = 0; i < data.FaceMatches.length; i++) {
                    var result = {
                        "similiriarity": data.FaceMatches[i].Similarity,
                        "userMatch": data.FaceMatches[i].Face.ExternalImageId
                    }
                    console.log(result)
                }
            }
        });
    }

}


module.exports = RekognitionService;