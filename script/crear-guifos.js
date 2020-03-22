(function createGifos() {
  const api_key = "GxuGBQb1Yox5Ca41dSgHpDPPpIJxjaJB";
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
    document.getElementById("cancel").addEventListener("click", backToIndex);

    setStartRecordingButtonEventListeners("Comenzar", () => {
      removeNode("pop-up-style", "text-pop-up", makeVideoContainer);
      document.getElementById("cancel").removeEventListener("click", backToIndex);
      event();
    });
  }

  function backToIndex() {
    document.location.href = "index.html";
  }

  function event() {
    document.getElementById("my-gifos-tittle").innerText = "Un Chequeo Antes de Empezar";
    document.getElementById("first-button-text").classList.add("hidden");
    document.getElementById("cancel").style.padding = "1.5% 2%";
    [...document.getElementsByClassName("general-button")].forEach(
      item => (item.style.margin = "0")
    );
    toggleImgDependingThemes("first-button-img", "images/camera.svg", "images/camera_light.svg");
    document.getElementById("first-button-img").classList.remove("hidden");
  }

  function setStartRecordingButtonEventListeners(buttonText, eventFunction) {
    const button = document.getElementById("start");
    button.addEventListener("click", eventFunction, { once: true });
    button.innerHTML = buttonText;
  }

  function makeVideoContainer() {
    const buttonsContainer = document.getElementById("1st-window-button-conntainer");

    const videoContainer = document.createElement("div");
    const video = document.createElement("video");
    const img = document.createElement("img");

    videoContainer.classList.add("windows-style-box-prompt");
    videoContainer.style.margin = "1%";
    img.classList.add("hidden");
    img.id = "gif-preview";

    videoContainer.appendChild(video);
    videoContainer.appendChild(img);
    buttonsContainer.before(videoContainer);

    getVideoForGif();
  }

  async function getVideoForGif() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { height: { max: 480 } }
      });

      video = document.querySelector("video");
      video.classList.add("removable-video");
      video.srcObject = stream;
      video.play();

      recorder = new RecordRTCPromisesHandler(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240
      });

      recorder.stream = stream;

      setStartRecordingButtonEventListeners("Capturar", () => {
        (document.getElementById("my-gifos-tittle").innerText = "Capturando Tu Guifo"),
          [...document.getElementsByClassName("general-button")].forEach(item =>
            item.classList.add("general-button-active")
          );
        toggleImgDependingThemes(
          "first-button-img",
          "images/recording.svg",
          "images/recording_dark.svg"
        );
        startRecordingEvent();
      });
    } catch (err) {
      console.log(err.name + ": " + err.message);
    }
  }

  function recordingToPreviewStyleChanges() {
    document.getElementById("my-gifos-tittle").innerText = "Vista Previa";
    document.getElementById("first-button-text").classList.remove("hidden");
    document.getElementById("cancel").style.removeProperty("padding");
    document.getElementById("cancel").style.removeProperty("margin");
    document.getElementById("start").style.removeProperty("margin");
    document.getElementById("first-button-img").classList.add("hidden");

    [...document.getElementsByClassName("general-button")].forEach(item => {
      item.classList.remove("general-button-active");
      document.querySelector("video").classList.add("hidden");
      document.getElementById("gif-preview").classList.remove("hidden");
    });
  }

  async function startRecordingEvent() {
    setTimer();
    await recorder.startRecording();
    // setStartRecordingButtonEventListeners("Listo", () => {
    //   clearTimer(timerId);
    //   recordingToPreviewStyleChanges();
    //   stopRecording();
    // });
  }

  function setTimer() {
    document.getElementById("timer").classList.remove("hidden");
    const timerContainer = document.getElementById("seconds");
    let timer = 0;

    const timerId = setInterval(function() {
      timer++;
      timerContainer.innerHTML = String(timer);
    }, 1000);

    stopTimer(timerId);
  }

  function stopTimer(timerId) {
    setStartRecordingButtonEventListeners("Listo", () => {
      clearInterval(timerId);
      clearTimeout(timeOutId);
      recordingToPreviewStyleChanges();
      stopRecording();
    });

    const timeOutId = setTimeout(() => {
      clearInterval(timerId);
      recordingToPreviewStyleChanges();
      stopRecording();
    }, 32000);
  }

  async function stopRecording() {
    await recorder.stopRecording();
    // video.srcObject = null;
    blob = await recorder.getBlob();
    document.getElementById("gif-preview").src = URL.createObjectURL(blob);
    recorder.stream.getTracks()[0].stop();

    // reset recorder's state
    await recorder.reset();

    // clear the memory
    await recorder.destroy();

    // so that we can record again
    recorder = null;

    setStartRecordingButtonEventListeners("Subir Guifo", () => {
      uploadVideo(blob);
      removeNode("pop-up-style", "windows-style-box-prompt", createUploadingView);
      document.getElementById("cancel").classList.add("hidden");
    });

    document.getElementById("first-button-text").innerHTML = "Repetir Captura";
    document.getElementById("cancel").addEventListener("click", () => {
      removeNode("pop-up-style", "windows-style-box-prompt", makeVideoContainer);
      event();
    });
  }

  function createUploadingView() {
    const buttonsContainer = document.getElementById("1st-window-button-conntainer");
    const container = document.createElement("div");
    const contentContainer = document.createElement("div");
    const image = document.createElement("img");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const loadingBar = document.createElement("div");
    const spanElementQuantity = 23;

    for (let index = 1; index <= spanElementQuantity; index++) {
      const bar = document.createElement("span");
      bar.id = `loading${index}`;
      bar.classList.add("loading-bar");
      loadingBar.appendChild(bar);
    }

    container.classList.add("windows-style-upload-prompt");
    contentContainer.classList.add("uploading-container");
    image.src = "images/globe_img.png";
    p1.classList.add("upload-p");
    p2.classList.add("upload-p");
    p1.innerHTML = "Estamos subiendo tu guifo…";
    p2.innerHTML = "Tiempo restante: algunos minutos";
    loadingBar.classList.add("loading-bar-container");

    container.appendChild(contentContainer);
    contentContainer.appendChild(image);
    contentContainer.appendChild(p1);
    contentContainer.appendChild(loadingBar);
    contentContainer.appendChild(p2);
    buttonsContainer.before(container);
  }

  async function uploadVideo(blob) {
    let abort = false;
    const form = new FormData();
    form.append("file", blob, "guifo.gif");

    setStartRecordingButtonEventListeners("Cancelar", () => {
      abort = true;
      backToIndex();
    });

    try {
      const url = `https://upload.giphy.com/v1/gifs?api_key=${api_key}`;
      const gifPost = fetch(url, {
        method: "POST",
        body: form
      });

      const {
        data: { id: gifId }
      } = await (await gifPost).json();
      const newGifUrl = `https://media.giphy.com/media/${gifId}/giphy.gif`;

      console.log("antes del return");

      if (abort) return;

      console.log("despues del return");

      setNewGifInLocalStorage(newGifUrl);
    } catch (err) {
      console.log(err);
    }

    function setNewGifInLocalStorage(newGifUrl) {
      if (sessionStorage.getItem("myGifs")) {
        const gifsSessionStorage = sessionStorage.getItem("myGifs");
        const myGifs = gifsSessionStorage.split(",");
        myGifs.unshift(newGifUrl);

        sessionStorage.setItem("myGifs", myGifs);

        newInputs.forEach(value => {
          createMyGif(myGifs);
        });

        return;
      }

      sessionStorage.setItem("search_input", newGifUrl);
      createMyGif(newGifUrl);
    }

    function createMyGif(value) {
      const container = document.createElement("figure");
      const imageElement = document.createElement("img");

      imageElement.classList.add("trends-img");

      imageElement.src = value;

      container.appendChild(imageElement);
      document.getElementsByClassName("mis-guifos")[0].appendChild(container);
    }
  }
})();
