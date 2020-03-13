const api_key = "GxuGBQb1Yox5Ca41dSgHpDPPpIJxjaJB";
const stylesheet = document.getElementById("stylesheet").src;

setInicialThemeValueInLocalStorage();
preventDefaultForm("search-form");
getNRandomGifs(4);
// getTrendingGifs();
setEventListeners();

function setEventListeners() {
  const buttonDayTheme = document.getElementById("day");
  const buttonNightTheme = document.getElementById("night");
  const input = document.getElementById("search");
  const form = document.getElementById("search-form");
  // const searchButton = document.getElementById("search-button");

  buttonDayTheme.addEventListener("click", changeToDayTheme);
  buttonNightTheme.addEventListener("click", changeToNightTheme);
  input.addEventListener("input", suggestionsKeyUp);
  form.addEventListener("submit", lauchSearch);
  suggestionsEventListener();
}

function setInicialThemeValueInLocalStorage() {
  if (localStorage.getItem("theme")) {
    getThemeFromLocalStorage();
    return;
  }

  localStorage.setItem("theme", "");
}

function preventDefaultForm(formId) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", event => event.preventDefault());
}

function changeToDayTheme() {
  document.getElementById("stylesheet").href = "style/sailor-day.css";
  changeThemeImagesSrc("logo", "images/gifOF_logo.png");
  changeThemeImagesSrc("lupa", "images/lupa_inactive.svg");
  changeThemeImagesSrc("dropdown", "images/dropdown.svg");

  // camara
  // recording imagen

  localStorage.setItem("theme", "style/sailor-day.css");
}

function changeToNightTheme() {
  document.getElementById("stylesheet").href = "style/sailor-night.css";
  changeThemeImagesSrc("logo", "images/gifOF_logo_dark.png");
  changeThemeImagesSrc("lupa", "images/combined-shape.svg");
  changeThemeImagesSrc("dropdown", "images/forward.svg");

  localStorage.setItem("theme", "style/sailor-night.css");
}

function changeThemeImagesSrc(elementId, newSrc) {
  document.getElementById(elementId).src = newSrc;
}

function suggestionsKeyUp() {
  activeSearch();
  event.preventDefault;
  logkey();
  document.getElementById("search").removeEventListener("keyup", suggestionsKeyUp);
}

function lauchSearch() {
  preventDefaultForm("search-form");
  removeNode("display-results-container", "removable-title", console.log);
  removeNode("display-results-container", "removable-container", getGifsBySearch);
  document.getElementById("search-suggestions").style.display = "none";
}

function suggestionsEventListener() {
  const searchSuggestionContainer = document.getElementById("search-suggestions");
  const searchSuggestion1 = document.getElementById("serach-suggestion-1");
  const searchSuggestion2 = document.getElementById("serach-suggestion-2");
  const searchSuggestion3 = document.getElementById("serach-suggestion-3");

  searchSuggestion1.addEventListener("click", () => {
    removeNode("display-results-container", "removable-title", console.log);
    removeNode("display-results-container", "removable-container", () => {
      getGifsBySearch(" divertido");
    });
    searchSuggestionContainer.style.display = "none";
    document.getElementById("search").value = "";
  });

  searchSuggestion2.addEventListener("click", () => {
    removeNode("display-results-container", "removable-title", console.log);
    removeNode("display-results-container", "removable-container", () => {
      getGifsBySearch(" hermoso");
    });
    searchSuggestionContainer.style.display = "none";
    document.getElementById("search").value = "";
  });

  searchSuggestion3.addEventListener("click", () => {
    removeNode("display-results-container", "removable-title", console.log);
    removeNode("display-results-container", "removable-container", () => {
      getGifsBySearch(" maravilloso");
    });
    searchSuggestionContainer.style.display = "none";
    document.getElementById("search").value = "";
  });
}

function logkey() {
  const searchSuggestionContainer = document.getElementById("search-suggestions");
  const searchSuggestion1 = document.getElementById("serach-suggestion-1");
  const searchSuggestion2 = document.getElementById("serach-suggestion-2");
  const searchSuggestion3 = document.getElementById("serach-suggestion-3");
  let input = document.getElementById("search").value;

  searchSuggestionContainer.style.display = "inline-block";
  searchSuggestion1.innerHTML = `${input} divertido`;
  searchSuggestion2.innerHTML = `${input} hermoso`;
  searchSuggestion3.innerHTML = `${input} maravilloso`;
}

// function getThemeFromLocalStorage(actionNightTheme, actionDayTheme) {
//   console.log(typeof actionNightTheme);
//   actionNightTheme();
//   if (localStorage.getItem("theme") === "style/sailor-night.css") {
//     actionNightTheme();
//   } else {
//     actionDayTheme();
//   }
// }

function getThemeFromLocalStorage() {
  if (localStorage.getItem("theme") === "style/sailor-night.css") {
    changeToNightTheme();
  } else {
    changeToDayTheme();
  }
}

function activeSearch() {
  const input = document.getElementById("search").value;
  const inputLength = input.length;
  const searchButton = document.getElementById("search-button");

  if (inputLength != 0) {
    searchButton.removeAttribute("disabled", "true");
    searchButton.setAttribute("enabled", "true");
    document.getElementById("lupa").src = "images/lupa.svg";
    changeThemeImagesSrc("lupa", "images/combined-shape.svg");
    searchButton.classList.replace("disabled-search-button", "search-button-input");
  }
}

function removeNode(parentClass, removableChildClass, action = "") {
  const [containerElement] = document.getElementsByClassName(parentClass);

  if (containerElement.hasChildNodes()) {
    document.getElementsByClassName(removableChildClass)[0].remove();
  }

  action();
}

async function getGifsBySearch(suggestion = " ") {
  const searchElement = document.getElementById("search");
  const searchInput = searchElement.value;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${searchInput}${suggestion}&limit=24&offset=0&rating=G&lang=es`;
  const searchResults = await fetch(url);
  const { data: gifs } = await searchResults.json();

  saveSerachInputInSessionStorage(searchInput);
  makeSearchedResultsContainer(searchInput, suggestion);

  gifs.forEach(displaySearchedResults);
}

function saveSerachInputInSessionStorage(searchInput) {
  if (sessionStorage.getItem("search_input")) {
    const searchSessionStorage = sessionStorage.getItem("search_input");
    const oldInputs = searchSessionStorage.split(",");
    oldInputs.push(searchInput);
    const newInputs = oldInputs.filter((value, index, array) => array.indexOf(value) === index);

    console.log(newInputs);

    sessionStorage.setItem("search_input", newInputs);

    newInputs.forEach(value => {
      createQuickSearchButton(value);
    });

    return;
  }

  sessionStorage.setItem("search_input", searchInput);
}

function createQuickSearchButton(value) {
  const container = document.getElementById("local-storage-search-suggestions");
  const buttonElement = document.createElement("button");

  buttonElement.classList.add("general-blue-button", "quick-search-button");
  buttonElement.innerHTML = value;

  return container.appendChild(buttonElement);
}

function makeSearchedResultsContainer(searchInput, suggestion = " ") {
  const [searchContainer] = document.getElementsByClassName("display-results-container");
  const titleContainer = searchContainer.appendChild(document.createElement("h2"));
  const container = searchContainer.appendChild(document.createElement("div"));

  container.classList.add("removable-container");
  titleContainer.classList.add("box-rose-border", "removable-title");
  titleContainer.innerHTML = `${searchInput} ${suggestion} (resultados)`;
}

function displaySearchedResults(gifs) {
  const [searchContainer] = document.getElementsByClassName("removable-container");
  const containerElement = searchContainer.appendChild(document.createElement("div"));
  const titleElement = containerElement.appendChild(document.createElement("h2"));
  const imageElement = titleElement.appendChild(document.createElement("img"));

  containerElement.classList.add("trends-item");
  titleElement.classList.add("gradient-bar", "trends-hashtag");
  imageElement.classList.add("trends-img");

  titleElement.innerHTML = gifs.title;
  imageElement.src = gifs.images.downsized.url;

  searchContainer.appendChild(containerElement);
  containerElement.appendChild(imageElement);
}

async function getRandomGifs() {}

async function getNRandomGifs(quantity) {
  let counter = 0;
  do {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=&rating=G`;
    const searchResults = await fetch(url);
    const { data: gifs } = await searchResults.json();
    displayRandomResults(gifs);

    counter = counter + 1;
  } while (counter < quantity);
}

function displayRandomResults(gifs) {
  const container = document.createElement("figure");
  const titleContainer = document.createElement("figcaption");
  const title = document.createElement("h2");
  const closeButton = document.createElement("img");
  const imageElement = document.createElement("img");
  const buttonLink = document.createElement("a");
  const recomendedSectionElement = document.getElementById("recomended-box");

  container.classList.add("windows-style-box", "recomended");
  titleContainer.classList.add("gradient-bar", "align-tittle-container");
  title.classList.add("reduce-tittle");
  closeButton.classList.add("close-button");
  imageElement.classList.add("recomended-item");
  buttonLink.classList.add("gif-see-more-button", "general-blue-button");

  closeButton.src = "./images/button_close.svg";
  imageElement.src = gifs.images.downsized.url;
  title.innerHTML = gifs.user.display_name;
  buttonLink.innerHTML = "Ver mas ...";

  buttonLink.addEventListener("click", () => {
    removeNode("display-results-container", "removable-title", console.log);
    removeNode(
      "display-results-container",
      "removable-container",
      getGifsBySearch(title.innerText)
    );
  });

  titleContainer.appendChild(title);
  titleContainer.appendChild(closeButton);
  container.appendChild(titleContainer);
  container.appendChild(imageElement);

  recomendedSectionElement.appendChild(container);
  container.appendChild(buttonLink);
}

async function getTrendingGifs() {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=24&rating=G`;
  const searchResults = await fetch(url);
  const { data: gifs } = await searchResults.json();

  gifs.forEach(displayTrendingResults);
}

function displayTrendingResults(gifs) {
  const container = document.createElement("figure");
  const caption = document.createElement("figcaption");
  const imageElement = document.createElement("img");
  const trendsSectionElement = document.getElementsByClassName("trends-grid")[0];

  caption.classList.add("gradient-bar", "trends-hashtag");
  imageElement.classList.add("trends-img");

  imageElement.src = gifs.images.downsized_large.url;
  caption.innerHTML = gifs.title;
  container.appendChild(imageElement);
  container.appendChild(caption);

  trendsSectionElement.appendChild(container);
}
