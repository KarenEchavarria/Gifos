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

function removeNode(parentClass, removableChildClass, action = "") {
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
//   changeThemeImagesSrc("logo", "images/gifOF_logo.png");
//   changeThemeImagesSrc("lupa", "images/lupa_inactive.svg");
//   changeThemeImagesSrc("dropdown", "images/dropdown.svg");

  // camara
  // recording imagen

  localStorage.setItem("theme", "style/sailor-day.css");
}

function changeToNightTheme() {
  document.getElementById("stylesheet").href = "style/sailor-night.css";
//   changeThemeImagesSrc("logo", "images/gifOF_logo_dark.png");
//   changeThemeImagesSrc("lupa", "images/combined-shape.svg");
//   changeThemeImagesSrc("dropdown", "images/forward.svg");

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


// function changeThemeImagesSrc(elementId, newSrc) {
//   document.getElementById(elementId).src = newSrc;
// }
