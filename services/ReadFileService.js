const fs = require("fs");
const RekognitionService = require("../services/RekoService");

class ReadFileService{ 
 read() {
    fs.readFile("testpicture.png", function (err, data) {
        if (err) throw err;
        
        var file = data;

        const analyzeFace = rekognitionService.analyze(file);
       
        })
    }
}

module.exports = ReadFileService;