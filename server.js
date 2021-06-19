const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const aws = require("aws-sdk");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
const port = process.env.PORT;
const region = process.env.REGION


//multiple uploads
const facesUpload = multer().array("facial_comp");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//application routes
app.post("/detectlabel", upload.single("image"), (req, res) => {
  let file = req.file.buffer;
  //setting aws
  aws.config.update({ region: region});

  let rekognition = new aws.Rekognition();

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
app.post("/facialAnalyze", upload.single("img_face"), (req, res) => {
  let file = req.file.buffer;

  aws.config.update({ region: region });

  let rekognition = new aws.Rekognition();

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

  aws.config.update({ region: region });

  let rekognition = new aws.Rekognition();

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
  aws.config.update({ region: region});

  let rekognition = new aws.Rekognition();

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
app.post("/indexImage", upload.single("add_file"), (req, res) => {
  aws.config.update({ region: region });
  let rekognition = new aws.Rekognition();

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
app.post("/searchImage", upload.single("filesearch"), (req, res) => {
  let file = req.file.buffer;

  aws.config.update({ region: region });

  let rekognition = new aws.Rekognition();

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


const server = app.listen(port, () => {
  console.log("application running on port " + port);
});
