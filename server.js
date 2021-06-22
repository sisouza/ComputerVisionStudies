const express = require("express");
const app = express();
const aws = require("aws-sdk");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
const {PORT, REGION, BUCKET_NAME} = process.env;

const rekognition = new aws.Rekognition();
aws.config.update({ region: REGION});

//multiple uploads
const facesUpload = multer().array("facial_comp");
const uploadImage =  upload.single("image");

app.use(express.json());

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

//Facial Comparation
app.post("/compareFaces", facesUpload, (req, res) => {
  let fileOne = req.files[0].buffer;
  let fileTwo = req.files[1].buffer;

  let params = {
    SourceImage: {
      Bytes: fileOne
    },
    TargetImage: {
      Bytes: fileTwo
    },
    SimilarityThreshold: 90
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

//create a collection (get from url)
app.get("/createaCollection", (req, res) => {

  let params = {
    CollectionId: "users"
  };

  rekognition.createCollection(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

//add one image to a collection
app.post("/indexImage", uploadImage, (req, res) => {

  let file = req.file.buffer;

  let params = {
    CollectionId: "users",
    Image: {
      Bytes: file
    },
    DetectionAttributes: ["ALL"],
    ExternalImageId: req.file.originalname,
    MaxFaces: 10,
    QualityFilter: "AUTO"
  };

  rekognition.indexFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

//search image in a collection
app.post("/searchImage", uploadImage, (req, res) => {
  let file = req.file.buffer;

  let params = {
    CollectionId: "users",
    Image: {
      Bytes: file
    },
    FaceMatchThreshold: 80,
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


const server = app.listen(PORT, () => {
  console.log("application running on port " + PORT);
});
