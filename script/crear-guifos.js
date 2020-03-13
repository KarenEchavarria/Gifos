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

    document.getElementById("start").addEventListener("click", event, { once: true });
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
    const startRecordingButton = document.getElementById("start");
    startRecordingButton.addEventListener("click", startRecordingEvent);
  }

  async function startRecordingEvent() {
    const startRecordingButton = document.getElementById("start");
    startRecordingButton.removeEventListener("click", startRecordingEvent);
    await recorder.startRecording();
    stopRecordingEvent();
  }

  function stopRecordingEvent() {
    const stopRecordingButton = document.getElementById("start");
    stopRecordingButton.innerHTML = "Listo";
    stopRecordingButton.addEventListener("click", stopRecording);
  }

  async function stopRecording() {
    await recorder.stopRecording();
    video.srcObject = null;
    blob = await recorder.getBlob();

    getGifFile(blob);
    console.log(blob);
    video.src = URL.createObjectURL(blob);
    console.log(video.src);
    recorder.stream.getTracks()[0].stop();

    const stoptRecordingButton = document.getElementById("start");
    stoptRecordingButton.addEventListener("click", stopRecording);
    stoptRecordingButton.innerHTML = "Subir Guifo";

    // reset recorder's state
    await recorder.reset();

    // clear the memory
    await recorder.destroy();

    // // so that we can record again
    recorder = null;
  }

  function getGifFile(blob) {
    document.getElementById("start").removeEventListener("click", stopRecording);
    form = new FormData();
    form.append("file", blob, "gif-1");
  }

  // console.log(form);
})();
