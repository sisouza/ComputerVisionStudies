const S3Service = require('../services/S3service');
const fs = require("fs")

const s3service = new S3Service


class S3ServiceController {
    async uploadSinglePicture(req, res) {
        var file = req.file;
        const image = await s3service.addFile(file)

        res.send(image)
    }


}


module.exports = new S3ServiceController()