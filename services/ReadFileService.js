const fs = require("fs");
const RekognitionService = require("../services/RekognitionService");

class ReadFileService{ 
 read() {
    fs.readFile("testpicture.png", function (err, data) {
        if (err) throw err;
        
        var file = data;

        const analyzeText = rekognitionService.detectText(file);
       
        })
    }
}

module.exports = ReadFileService;