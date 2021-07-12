let videoElement = document.querySelector("video");
let recordButton = document.querySelector(".inner-record");
let capturePhoto = document.querySelector(".inner-capture");
let mediaRecorder;
let recordingState = false;

let filters = document.querySelectorAll(".filter");
let filterSelected = "none";

//Using await we can also perform the same functionality..

(async function () {
    let constraint = { video: true };
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraint);

    videoElement.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.onstart = function (e) {
        console.log("Inside on start");
    };

    mediaRecorder.ondataavailable = function (e) {
        console.log("Inside on data available");
        console.log(e.data);

        let videoObject = new Blob([e.data], { type: "video/mp4" }); //will change the video format..
        // console.log(videoObject);
        //videoObject/imageObject => URL
        //aTag

        let videoURL = URL.createObjectURL(videoObject);
        let aTag = document.createElement("a");
        aTag.download = `Video${Date.now()}.mp4`;
        aTag.href = videoURL;
        aTag.click();

    };

    mediaRecorder.onstop = function () {
        console.log("Inside on stop");
    };

    recordButton.addEventListener("click", function () {
        if (recordingState) {
            //already recording is going on..
            //stop the recording..
            mediaRecorder.stop();
            // recordButton.innerHTML = "Record Video" ;
            recordButton.classList.remove("animate-record");
            recordingState = false;
        } else {
            //start the recording..
            mediaRecorder.start();
            // recordButton.innerHTML = "Recording.." ;
            recordButton.classList.add("animate-record");
            recordingState = true;
        }
    });

    capturePhoto.addEventListener("click", function () {
        capturePhoto.classList.add("animate-capture");

        setTimeout(function () {
            capturePhoto.classList.remove("animate-capture");
        }, 1000);

        //canvas..
        let canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0);

        if(filterSelected != "none"){
            ctx.fillStyle = filterSelected ;
            ctx.fillRect(0, 0, canvas.width, canvas.height) ;
        }
        //download canvas as an image..
        let aTag = document.createElement("a");
        aTag.download = `Image${Date.now()}.jpg`;
        aTag.href = canvas.toDataURL("image/jpg");
        aTag.click();
        
    })

})();

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {

      let currentFilterSelected = e.target.style.backgroundColor;

      if (currentFilterSelected == "") {
        if (document.querySelector(".filter-div")) {
          document.querySelector(".filter-div").remove();
          filterSelected = "none";
          return;
        }
      }
  
      console.log(currentFilterSelected);
      if (filterSelected == currentFilterSelected) {
        return;
      }
  
      let filterDiv = document.createElement("div");
      filterDiv.classList.add("filter-div");
      filterDiv.style.backgroundColor = currentFilterSelected;
  
      if (filterSelected == "none") {
        document.body.append(filterDiv);

      } else {

        document.querySelector(".filter-div").remove();
        document.body.append(filterDiv);

      }
      filterSelected = currentFilterSelected;
    });
  }

