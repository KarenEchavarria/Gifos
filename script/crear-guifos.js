(function createGifos() {
  // const api_key = "GxuGBQb1Yox5Ca41dSgHpDPPpIJxjaJB";
  const api_key = "gOD5XFTrM89dBlE4WuG3BoB28XPaz3jX";
  let video;
  let recorder;
  let blob;
  let intervalId;
  let timerId;

  setEventListeners();
  setInicialThemeValueInLocalStorage();
  hiddenMenu();
  preventDefaultForm("1st-window-button-conntainer");
  getMyGifsFromLocalStorage();

  function hiddenMenu() {
    const [menu] = document.getElementsByTagName("ul");
    menu.classList = "hidden";
  }

  function setEventListeners() {
    document.getElementById("cancel").addEventListener("click", backToIndex);

    setStartRecordingButtonEventListeners("Comenzar", () => {
      removeNode("first-pop-up-style", "text-pop-up", makeVideoContainer);
      document.getElementById("cancel").removeEventListener("click", backToIndex);
      event();
    });
  }

  function backToIndex() {
    document.location.href = "index.html";
  }

  function event() {
    document
      .getElementById("create-gifos-container")
      .classList.replace("first-pop-up-style", "pop-up-style");
    document.getElementById("create-gifos-tittle").innerText = "Un Chequeo Antes de Empezar";
    document.getElementById("first-button-text").classList.add("hidden");
    document.getElementById("create-guifos-close-button").classList.remove("hidden");
    document.getElementById("cancel").style.padding = "1.5% 2%";
    [...document.getElementsByClassName("general-button")].forEach(
      item => (item.style.marginLeft = "0%")
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
        (document.getElementById("create-gifos-tittle").innerText = "Capturando Tu Guifo"),
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
    document.getElementById("create-gifos-tittle").innerText = "Vista Previa";
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

    document
      .getElementById("cancel")
      .classList.replace("general-button", "general-button-secondary");
  }

  async function startRecordingEvent() {
    setTimer();
    await recorder.startRecording();

    setStartRecordingButtonEventListeners("Listo", () => {
      recordingToPreviewStyleChanges();
      stopRecording();
      stopTimer(timerId);
    });
  }

  function setTimer() {
    document.getElementById("timer").classList.remove("hidden");
    const timerContainer = document.getElementById("seconds");
    let timer = 0;

    timerId = setInterval(function() {
      if (timer < 9){
      timer++;
      timerContainer.innerHTML = `0${String(timer)}`;
      } else {
        timer++;
      timerContainer.innerHTML = String(timer);
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    clearTimeout(timeOutId);
    document.getElementById("create-guifos-close-button").classList.add("hidden");
  }

  const timeOutId = setTimeout(() => {
    clearInterval(timerId);
    recordingToPreviewStyleChanges();
    document.getElementById("create-guifos-close-button").classList.add("hidden");
    stopRecording();
  }, 24000);

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

    document.getElementById("forward-arrow").classList.remove("hidden");
    makeLoadingBar("forward-arrow", 17, "first-loading-bar-container");
    addFunctionalityToProgressBar(17, 200);

    setStartRecordingButtonEventListeners("Subir Guifo", setStyleChangesForUploadingView);

    document.getElementById("first-button-text").innerHTML = "Repetir Captura";
    document.getElementById("cancel").addEventListener(
      "click",
      () => {
        removeNode("pop-up-style", "windows-style-box-prompt", makeVideoContainer);
        document
          .getElementById("cancel")
          .classList.replace("general-button-secondary", "general-button");
        event();
        document
          .getElementById("start")
          .removeEventListener("click", setStyleChangesForUploadingView);
        stopTimer(timerId);
        document.getElementById("timer").classList.add("hidden");
        document.getElementById("forward-arrow").classList.add("hidden");
        removeNode("pop-up-style", "first-loading-bar-container", console.log);
      },
      { once: true }
    );
  }

  function setStyleChangesForUploadingView() {
    clearInterval(intervalId);
    document.getElementById("timer").classList.add("hidden");
    document.getElementById("forward-arrow").classList.add("hidden");
    removeNode("pop-up-style", "first-loading-bar-container", console.log);
    uploadVideo(blob);
    removeNode("pop-up-style", "windows-style-box-prompt", createUploadingView);
    document.getElementById("cancel").classList.add("hidden");
    document.getElementById("create-guifos-close-button").classList.remove("hidden");
    document
      .getElementById("start")
      .classList.replace("general-button", "general-button-secondary");
  }

  function createUploadingView() {
    const buttonsContainer = document.getElementById("1st-window-button-conntainer");
    const container = document.createElement("div");
    const contentContainer = document.createElement("div");
    const image = document.createElement("img");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");

    container.classList.add("windows-style-upload-prompt");
    contentContainer.classList.add("uploading-container");
    image.src = "images/globe_img.png";
    p1.classList.add("upload-p");
    p2.classList.add("upload-p");
    p1.id = "p1";
    p1.innerHTML = "Estamos subiendo tu guifo…";
    p2.innerHTML = "Tiempo restante: algunos minutos";

    container.appendChild(contentContainer);
    contentContainer.appendChild(image);
    contentContainer.appendChild(p1);
    contentContainer.appendChild(p2);
    buttonsContainer.before(container);

    makeLoadingBar("p1", 23, "loading-bar-container");
    addFunctionalityToProgressBar(23, 500);
  }

  function makeLoadingBar(appendedId, quantity, containerClass) {
    const buttonsContainer = document.getElementById(appendedId);
    const loadingBar = document.createElement("div");
    const spanElementQuantity = quantity;

    for (let index = 1; index <= spanElementQuantity; index++) {
      const bar = document.createElement("span");
      bar.id = `loading${index}`;
      bar.classList.add("loading-bar");
      loadingBar.appendChild(bar);
    }

    loadingBar.classList.add(containerClass);

    buttonsContainer.after(loadingBar);
  }

  function addFunctionalityToProgressBar(spanElementQuantity, miliseconds) {
    let counter = 0;
    intervalId = setInterval(() => {
      counter++;

      const bar = document.getElementById(`loading${counter}`);
      bar.classList.toggle("loading-bar-pink");
      if (counter === spanElementQuantity) {
        const pinkBars = document.querySelectorAll("span.loading-bar-pink");
        pinkBars.forEach(element => element.classList.replace("loading-bar-pink", "loading-bar"));
        counter = 0;
      }
    }, miliseconds);
  }

  async function uploadVideo(blob) {
    let controller = new AbortController();
    const form = new FormData();
    form.append("file", blob, "guifo.gif");

    setStartRecordingButtonEventListeners("Cancelar", () => {
      controller.abort();
      clearInterval(intervalId);
      document.location.href = "crear-guifos.html";
    });

    try {
      const url = `https://upload.giphy.com/v1/gifs?api_key=${api_key}`;
      const gifPost = fetch(url, {
        method: "POST",
        body: form,
        signal: controller.signal
      });

      const {
        data: { id: gifId }
      } = await (await gifPost).json();
      const newGifUrl = `https://media.giphy.com/media/${gifId}/giphy.gif`;

      clearInterval(intervalId);
      setNewGifInLocalStorage(newGifUrl);
    } catch (err) {
      console.log(err);
    }
  }

  function setNewGifInLocalStorage(newGifUrl) {
    if (localStorage.getItem("myGifs")) {
      const gifsLocalStorage = localStorage.getItem("myGifs");
      const myGifs = gifsLocalStorage.split(",");
      myGifs.unshift(newGifUrl);

      localStorage.setItem("myGifs", myGifs);

      removeNode("pop-up-style", "windows-style-upload-prompt", createShareView(myGifs));
      document
        .getElementById("create-gifos-container")
        .classList.replace("pop-up-style", "first-pop-up-style");
      document
        .getElementById("start")
        .classList.replace("general-button-secondary", "general-button");
      setStartRecordingButtonEventListeners("Listo", () => {
        backToIndex();
      });
      myGifs.forEach(value => {
        createMyGif(value);
      });

      return;
    }

    localStorage.setItem("myGifs", newGifUrl);
    removeNode("pop-up-style", "windows-style-upload-prompt", createShareView(newGifUrl));
    document
      .getElementById("create-gifos-container")
      .classList.replace("pop-up-style", "first-pop-up-style");
    createMyGif(newGifUrl);
  }

  function createShareView(newGifUrl) {
    const buttonsContainer = document.getElementById("1st-window-button-conntainer");
    const contentContainer = document.createElement("div");
    const buttonContainer = document.createElement("div");
    const image = document.createElement("img");
    const h3 = document.createElement("h3");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    contentContainer.classList.add("window-share-view");
    buttonContainer.classList.add("create-gifos-seconday-buttons-container");
    buttonContainer.style.flexDirection = "column";
    image.id = "gif-ready";
    image.src = newGifUrl;
    button1.classList.add("general-button-secondary");
    button2.classList.add("general-button-secondary");
    button1.innerHTML = "Copiar Enlace Guifo";
    button2.innerHTML = "Descargar Guifo";
    h3.innerHTML = "Guifo creado con éxito";

    contentContainer.appendChild(image);
    contentContainer.appendChild(buttonContainer);
    buttonContainer.appendChild(h3);
    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
    buttonsContainer.before(contentContainer);

    setShareButtonsEventListeners(newGifUrl);
  }

  function setShareButtonsEventListeners(newGifUrl) {
    const button1 = document.getElementsByClassName("general-button-secondary")[0];
    const button2 = document.getElementsByClassName("general-button-secondary")[1];
    const span = document.createElement("span");
    button1.appendChild(span);

    button1.addEventListener("click", () => {
      navigator.clipboard
        .writeText(newGifUrl)
        .then(() => {
          span.classList.add("tooltip-copy-text");
          span.innerHTML = "Enlace Copiado!";
          setTimeout(() => {
            span.style.visibility = "hidden";
          }, 1500);
        })
        .catch(err => {
          console.log("Something went wrong", err);
        });
    });

    button2.addEventListener("click", () => {});
  }
})();
