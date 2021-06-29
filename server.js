const express = require("express");
const app = express();
const aws = require("aws-sdk");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
const { PORT, AWS_REGION, BUCKET_NAME } = process.env;
//setup
const rekognition = new aws.Rekognition();
aws.config.update({ region: AWS_REGION });

//upload setup
const uploadImage = upload.single("image");

app.use(express.json());
app.use(express.static("public"));

//application routes

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//camera
app.post("/getImage", (req, res) => {

})

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
  rekognition.detectLabels(params, function (err, data) {
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

  rekognition.detectFaces(params, function (err, data) {
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
  //let file = req.file.buffer;
  //url from the target image (storage) profile pic
  var compare = "profile.png";

  var file = img;

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

  rekognition.compareFaces(params, function (err, data) {
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

//search image came from webcam and compare to faces storaged in collection
app.post("/searchImage", uploadImage, (req, res) => {
  let file = req.file.buffer;

  let params = {
    CollectionId: "usersTest",
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
      console.log(data);

      let table = "<table border=1>";

      for (var i = 0; i < data.FaceMatches.length; i++) {
        table += "<tr>";
        table += "<td>" + data.FaceMatches[i].Similarity + "</td>";
        table += "<td>" + data.FaceMatches[i].Face.ExternalImageId + "</td>";
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
