(function createGifos() {
  let video;
  let recorder;
  let blob;

  setEventListeners();
  hiddenMenu();
  preventDefaultForm("1st-window-button-conntainer");

  function hiddenMenu() {
    const [menu] = document.getElementsByTagName("ul");
    menu.classList = "hidden";
  }

  function setEventListeners() {
    document.getElementById("cancel").addEventListener("click", () => {
      document.location.href = "index.html";
    });

    document.getElementById("start").addEventListener("click", event);
  }

  function event() {
    removeNode("pop-up-style", "text-pop-up", makeVideoContainer);
  }

  function makeVideoContainer() {
    const buttonsContainer = document.getElementById("1st-window-button-conntainer");

    const videoContainer = document.createElement("div");
    const video = document.createElement("video");

    videoContainer.classList.add("windows-style-box-prompt");
    videoContainer.style.margin = "1%";
    video.setAttribute("autoplay", "playsinline");

    videoContainer.appendChild(video);
    buttonsContainer.before(videoContainer);

    const createGifButton1 = document.getElementById("start");
    createGifButton1.removeEventListener("click", event);
    createGifButton1.id = "start-recording-button";
    createGifButton1.innerHTML = "Capturar";

    getVideoForGif();
  }

  async function getVideoForGif() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { height: { max: 480 } }
      });

      recordVideo(stream);
    } catch (err) {
      console.log(err.name + ": " + err.message);
    }
  }

  async function recordVideo(stream) {
    video = document.querySelector("video");
    video.srcObject = stream;
    video.play();
    recorder = new RecordRTCPromisesHandler(stream, {
      type: "video",
      frameRate: 1,
      quality: 10,
      width: 360,
      hidden: 240
    });

    recorder.stream = stream;
    document
      .getElementById("start-recording-button")
      .addEventListener("click", startRecordingEvent);
  }

  async function startRecordingEvent() {
    const startRecordingButton = document.getElementById("start-recording-button");
    startRecordingButton.removeEventListener("click", startRecordingEvent);
    startRecordingButton.id = "stop-recording-button";
    startRecordingButton.innerHTML = "Listo";

    document
      .getElementById("stop-recording-button")
      .addEventListener("click", function stopRecordingEvent() {
        stopRecording();
      });

    await recorder.startRecording();
  }

  async function stopRecording() {
    await recorder.stopRecording();
    video.srcObject = null;
    blob = await recorder.getBlob();
    console.log(blob);
    video.src = URL.createObjectURL(blob);
    recorder.stream.getTracks()[0].stop();

    // console.log(form)

    // reset recorder's state
    await recorder.reset();

    // clear the memory
    await recorder.destroy();

    // // so that we can record again
    recorder = null;
  }

  function getGifFile(blob) {
    form = new FormData();
    form.append("file", blob, "gif-1");
  }

  // console.log(form);
})();
