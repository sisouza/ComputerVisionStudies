const opencv = require('opencv4nodejs');


class CaptureImageService {

   captureCamera() {
        const delay = 100;
        const Vcap = new opencv.VideoCapture(0);
        Vcap.set(opencv.CAP_PROP_FRAME_WIDTH, 800);
        Vcap.set(opencv.CAP_PROP_FRAME_HEIGHT, 800);
        Vcap.set(opencv.CAP_PROP_FPS, 5);

        var result = true;

        while (result) {
            const frame = Vcap.read();
            
            opencv.imshowWait('video', frame);

            const key = opencv.waitKey(delay); 
                if (key == 27) {
                    break;
                }
            
            const image = opencv.imwrite("testpicture.png", frame);

            result = false;
            Vcap.release();
            opencv.destroyAllWindows();
        }
    }
   
}


module.exports =  CaptureImageService;