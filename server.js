const express = require("express");
const app = express();
const aws = require("aws-sdk");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
const {PORT, AWS_REGION , BUCKET_NAME} = process.env;

app.use(express.json());

//setup
const rekognition = new aws.Rekognition();
aws.config.update({ region: AWS_REGION  });

const uploadImage = upload.single("image")


//application routes
app.post("/detectlabel", uploadImage, (req, res) => {
  let file = req.file.buffer;

  //setting params for upload
  let params = {
    Image: {
      Bytes: file
    },
    MaxLabels: 50,
    MinConfidence: 70.0
  };

  //get the images
  rekognition.detectLabels(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      //printing labels
      let table = "<table border=1>";

      for (var i = 0; i < data.Labels.length; i++) {
        table += "<tr>";
        table += "<td>" + data.Labels[i].Name + "</td>";
        table += "<td>" + data.Labels[i].Confidence + "</td>";
        table += "</tr>";
      }
      table += "</table>";
      res.send(table);
    }
  });
});

//facial analyze test
app.post("/facialAnalyze", uploadImage, (req, res) => {
  let file = req.file.buffer;

  //setting params 
  let params = {
    Image: {
      Bytes: file
    },
    Attributes: ["ALL"]
  };

  rekognition.detectFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      
      //printing results
      let table = "<table border=1>";

      for (var i = 0; i < data.FaceLabels.length; i++) {
        table += "<tr>";
        table += "<td>" + data.FaceLabels[i].AgeRange.Low + "</td>";
        table += "<td>" + data.FaceLabels[i].AgeRange.High + "</td>";
        table += "<td>" + data.FaceLabels[i].Gender.Value + "</td>";
        table += "<td>" + data.FaceLabels[i].Emotions[0].Type + "</td>";
        table += "</tr>";
      }
      table += "</table>";
      res.send(table);
    }
  });
});

//test
app.post("/testFacial", uploadImage, (req, res) => {
  
  //file that will be send via upload  on webcam
  let file = req.file.buffer;
  //url from the target image (storage) profile pic
  var compare = "profile.png";

  let params = {
    SourceImage: {
      Bytes: file
    },
    TargetImage: {
      S3Object: { 
         Bucket: BUCKET_NAME,
         Name: compare
      }
    },
    SimilarityThreshold: 80
  };

  rekognition.compareFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);

      let table = "<table border=1>";

      for (var i = 0; i < data.FaceMatches.length; i++) {
        table += "<tr>";
        table += "<td>" + data.FaceMatches[i].Similarity + "</td>";
        table += "</tr>";
      }
      table += "</table>";
      res.send(table);
    }
  });
});

//server setup
const server = app.listen(PORT, () => {
  console.log("application running on port " + PORT);
});
