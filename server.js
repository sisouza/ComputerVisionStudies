const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const aws = require("aws-sdk");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//application routes
app.post("/detectlabel", upload.single("image"), (req, res) => {
  let file = req.file.buffer;
  //setting aws
  aws.config.update({ region: "us-east-1" });

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

  aws.config.update({ region: "us-east-1" });

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

const server = app.listen(port, () => {
  console.log("application running on port " + port);
});
