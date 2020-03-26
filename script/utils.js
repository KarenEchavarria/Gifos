setListeners();

function setListeners() {
  document.getElementById("day").addEventListener("click", changeToDayTheme);
  document.getElementById("night").addEventListener("click", changeToNightTheme);
}

window.onload = () => {
  if (localStorage.getItem("visitors_counter")) {
    const oldVisits = localStorage.getItem("visitors_counter");
    const counter = Number(oldVisits) + 1;
    localStorage.setItem("visitors_counter", String(counter));
    document.getElementById("users-counter").innerHTML = String(counter);
    setInicialThemeValueInLocalStorage();

    return;
  }

  localStorage.setItem("visitors_counter", "1");
  document.getElementById("users-counter").innerHTML = "1";
  setInicialThemeValueInLocalStorage();
};

function preventDefaultForm(formId) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", event => event.preventDefault());
}

function removeNode(parentClass, removableChildClass, action = console.log) {
  const [containerElement] = document.getElementsByClassName(parentClass);

  if (containerElement.hasChildNodes()) {
    document.getElementsByClassName(removableChildClass)[0].remove();
  }

  action();
}

function setInicialThemeValueInLocalStorage() {
  if (localStorage.getItem("theme")) {
    getThemeFromLocalStorage();
    return;
  }

  localStorage.setItem("theme", "style/sailor-day.css");
}

function getThemeFromLocalStorage() {
  if (localStorage.getItem("theme") === "style/sailor-night.css") {
    changeToNightTheme();
  } else {
    changeToDayTheme();
  }
}

function changeToDayTheme() {
  document.getElementById("stylesheet").href = "style/sailor-day.css";
  changeThemeImagesSrc("logo", "images/gifOF_logo.png");
  changeThemeImagesSrc("dropdown", "images/dropdown.svg");

  if (document.getElementById("lupa")) {
    changeThemeImagesSrc("lupa", "images/lupa_inactive.svg");
  }

  localStorage.setItem("theme", "style/sailor-day.css");
}

function changeToNightTheme() {
  document.getElementById("stylesheet").href = "style/sailor-night.css";
  changeThemeImagesSrc("logo", "images/gifOF_logo_dark.png");
  changeThemeImagesSrc("dropdown", "images/forward.svg");

  if (document.getElementById("lupa")) {
    changeThemeImagesSrc("lupa", "images/combined-shape.svg");
  }

  localStorage.setItem("theme", "style/sailor-night.css");
}

function toggleImgDependingThemes(imgId, imgDay, imgNight) {
  const theme = localStorage.getItem("theme");
  const img = document.getElementById(imgId);

  if (theme === "style/sailor-day.css") {
    img.src = imgDay;
  } else {
    img.src = imgNight;
  }
}

function createMyGif(value) {
  const container = document.createElement("figure");
  const imageElement = document.createElement("img");

  imageElement.classList.add("trends-img");

  imageElement.src = value;

  container.appendChild(imageElement);
  document.getElementsByClassName("mis-guifos")[0].appendChild(container);
}

function changeThemeImagesSrc(elementId, newSrc) {
  document.getElementById(elementId).src = newSrc;
}

function getMyGifsFromLocalStorage() {
  const gifsLocalStorage = localStorage.getItem("myGifs");
  const myGifs = gifsLocalStorage.split(",");
  myGifs.forEach(value => {
      createMyGif(value);
  });
  }
