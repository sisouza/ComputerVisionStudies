function getCamera(videoStream) {
    
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
    
    if (!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices) {
    alert("Camera API is not available in your browser");
    return;
    }
    
   
    var video = document.querySelector('#video');
        video.srcObject = videoStream;
        video.play();
    
    var screenshot = document.querySelector('#capture');
        screenshot.addEventListener('click', function () {
 
    var canvas = document.querySelector("#canvas");

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
    var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0)

        const img = document.createElement('img')
        img.src = canvas.toDataURL('image/png')
        screenshotsContainer.prepend(img)

        })
    }











