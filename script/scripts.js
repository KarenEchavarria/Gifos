const api_key = "GxuGBQb1Yox5Ca41dSgHpDPPpIJxjaJB";

preventDefaultForm("search-form");
getNRandomGifs(4);
getTrendingGifs();
setEventListeners();

function setEventListeners() {
  // document.getElementById("search-form").addEventListener("", changeSearchStyle();)
  const buttonDayTheme = document.getElementById("day");
  const buttonNightTheme = document.getElementById("night");

  buttonDayTheme.addEventListener("click", changeToDayTheme);
  buttonNightTheme.addEventListener("click", changeToNightTheme);

  addEventListener("submit", () => {
    preventDefaultForm("search-form");
    removeNode("display-results-container", "removable-title", console.log);
    removeNode("display-results-container", "removable-container", getGifsBySearch);
  });

  // function changeSearchStyle() {
  //   document.getElementById("search").addEventListener("input", () => {
  //     document
  //       .getElementsByClassName("search-button")[0]
  //       .classList.replace("search-button", "search-button-active");
  //     document.getElementById("lupa").src = "images/lupa.svg";
  //   });
  // }
}

function preventDefaultForm(formId) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", event => event.preventDefault());
}

function changeToDayTheme() {
  const theme = document.getElementById("stylesheet");
  const [logo] = document.getElementsByClassName("logo");

  // flechita del menu
  // lupa de la busqueda
  // camara
  // recording imagen

  theme.href = "style/sailor-day.css";
  logo.src = "images/gifOF_logo.png";
}

function changeToNightTheme() {
  const theme = document.getElementById("stylesheet");
  const [logo] = document.getElementsByClassName("logo");

  theme.href = "style/sailor-night.css";
  logo.src = "images/gifOF_logo_dark.png";
}

function makeSearchedResultsContainer() {
  const search = document.getElementById("search");
  const [searchContainer] = document.getElementsByClassName("display-results-container");
  const titleContainer = searchContainer.appendChild(document.createElement("h2"));
  const container = searchContainer.appendChild(document.createElement("div"));

  container.classList.add("removable-container");
  titleContainer.classList.add("box-rose-border", "removable-title");
  titleContainer.innerHTML = `${search.value} (resultados)`;
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

async function getGifsBySearch() {
  const searchElement = document.getElementById("search");
  const searchInput = searchElement.value;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${searchInput}&limit=24&offset=0&rating=G&lang=es`;
  const searchResults = await fetch(url);
  const { data: gifs } = await searchResults.json();

  makeSearchedResultsContainer();

  gifs.forEach(displaySearchedResults);
}

function removeNode(parentClass, removableChildClass, action = "none") {
  const [containerElement] = document.getElementsByClassName(parentClass);

  if (containerElement.hasChildNodes()) {
    const [removeChild] = document.getElementsByClassName(removableChildClass);

    removeChild.remove();
  }
  action();
}

async function getRandomGifs() {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=&rating=G`;
  const searchResults = await fetch(url);
  const { data: gifs } = await searchResults.json();

  displayRandomResults(gifs);
}

async function getNRandomGifs(quantity) {
  let counter = 0;
  do {
    await getRandomGifs();
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
  buttonLink.classList.add("gif-see-more-button");

  closeButton.src = "./images/button_close.svg";
  imageElement.src = gifs.images.downsized.url;
  title.innerHTML = gifs.user.display_name;
  buttonLink.innerHTML = "Ver mas ...";
  // buttonLink.src = gifs.;

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
