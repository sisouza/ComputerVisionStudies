function getCamera() {
    try {
        const videoStream = navigator.mediaDevices.getUserMedia({ video: true })
        var video = document.querySelector('#video');
        video.srcObject = videoStream;
        video.play();

    } catch (error) {
        console.log(error)
    }
}
    getCamera()
    
    var screenshot = document.querySelector('#capture');
        screenshot.addEventListener('click', function () {
            
    //drawing image on screen        
    var canvas = document.querySelector("#canvas");
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
    var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0)

        const img = document.createElement('img')
        img.src = canvas.toDataURL('image/png')
        screenshotsContainer.prepend(img)

        })
    

    










