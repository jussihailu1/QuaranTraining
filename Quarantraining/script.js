//See if the browser supports Service Workers, if so try to register one
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registering) {
      // Registration was successful
      console.log(
        "Browser: Service Worker registration is successful with the scope",
        registering.scope
      );
    })
    .catch(function (error) {
      //The registration of the service worker failed
      console.log(
        "Browser: Service Worker registration failed with the error",
        error
      );
    });
} else {
  //The registration of the service worker failed
  console.log("Browser: I don't support Service Workers :(");
}

// Dit zorgt ervoor dat wanneer de pagina refresht, het scroll effect blijft werken
document.scrollingElement.scrollTo(0, 0);

// Navigation

const navButtons = document.getElementsByClassName("nav-button");
const pages = document.getElementsByClassName("page");

for (const button of navButtons) {
  button.onclick = function () {
    for (const btn of navButtons) {
      btn.children[0].classList.remove("active");
    }
    const selectedPage = button.id.split("-")[1];
    button.children[0].classList.add("active");
    navigatePage(selectedPage);
    selectedPage != "home" ? document.getElementById('header').classList.add("fixed") : document.getElementById('header').classList.remove("fixed");
  };
}

function navigatePage(selectedPage) {
  for (const page of pages) {
    page.id.split("-")[2] == selectedPage
      ? (page.hidden = false)
      : (page.hidden = true);
  }
}

// Daily challenges

const difficulty = {
  controls: {
    container: document.getElementById("difficulty-controls"),
    left: document.getElementById("difficulty-control-left"),
    right: document.getElementById("difficulty-control-right"),
    naturalPosition: 0,
    sticky: false,
  },
  title: document.getElementById("tab-title"),
  levels: ["easy", "medium", "hard", "extreme"],
  current: {
    name: "",
    getIndex: function () {
      return difficulty.levels.findIndex(
        (difficultyName) => difficulty.current.name == difficultyName
      );
    },
  },
  contents: document.getElementsByClassName("difficulty-tab-content"),
};

function chooseDifficulty(difficultyName) {
  difficulty.title.innerHTML = difficultyName.toUpperCase();
  for (const content of difficulty.contents) {
    content.id.split("-")[2] == difficultyName
      ? (content.hidden = false)
      : (content.hidden = true);
  }
}

function toggleControls() {
  difficulty.controls.left.style.visibility =
    difficulty.current.getIndex() == 0 ? "hidden" : "visible";
  difficulty.controls.right.style.visibility =
    difficulty.current.getIndex() == difficulty.levels.length - 1
      ? "hidden"
      : "visible";
}

difficulty.controls.left.onclick = function () {
  difficulty.current.name =
    difficulty.levels[difficulty.current.getIndex() - 1];
  chooseDifficulty(difficulty.current.name);
  toggleControls();
};

difficulty.controls.right.onclick = function () {
  difficulty.current.name =
    difficulty.levels[difficulty.current.getIndex() + 1];
  chooseDifficulty(difficulty.current.name);
  toggleControls();
};

document.onscroll = function () {
  if (
    difficulty.controls.container.offsetTop >
    difficulty.controls.naturalPosition &&
    !difficulty.controls.sticky
  ) {
    difficulty.controls.sticky = true;
    difficulty.controls.container.classList.add("sticky");
  } else if (
    difficulty.controls.container.offsetTop ==
    difficulty.controls.naturalPosition &&
    difficulty.controls.sticky
  ) {
    difficulty.controls.sticky = false;
    difficulty.controls.container.classList.remove("sticky");
  }
};

function initDifficulty() {
  difficulty.controls.naturalPosition = difficulty.controls.container.offsetTop + 1;
  difficulty.current.name = difficulty.levels[0];

  toggleControls();
}

initDifficulty();

// Dit zorgt ervoor dat de poster weergegeven wordt nadat de video is afgespeeld

for (const vid of document.getElementsByClassName("post-vid")) {
  vid.addEventListener("ended", function () {
    vid.load();
  });
}

let dailyChallenges;
async function init() {
  await fetch("http://127.0.0.1:3000/challenges").then(response => response.json()).then(challenges => { dailyChallenges = challenges; });
  loadDailyChallenges();
}

function loadDailyChallenges() {
  const dcEasyContainer = document.getElementById('daily-challenges-easy');
  const dcMediumContainer = document.getElementById('daily-challenges-medium');
  const dcHardContainer = document.getElementById('daily-challenges-hard');

  const easyChallenges = dailyChallenges.filter(dc => dc.level == "easy");
  const mediumChallenges = dailyChallenges.filter(dc => dc.level == "medium");
  const hardChallenges = dailyChallenges.filter(dc => dc.level == "hard");

  let dcEasyString = "";
  let dcMediumString = "";
  let dcHardString = "";

  function cardString(name, image) {
    return `<div class="card">
              <img src="${image}" alt="${name}" class="challenge-img" />
              <div class="card-body">
                <h5 class="challenge-name">${name.toUpperCase()}</h5>
              </div>
            </div>`;
  }

  for (let i = 0; i < easyChallenges.length; i += 2) {
    const dcs = [easyChallenges[i], easyChallenges[i + 1]]
    let dcString = '<div class="row">';
    for (const dc of dcs) { dcString += cardString(dc.name, dc.image); }
    dcString += "</div>";
    dcEasyString += dcString;
  }

  for (let i = 0; i < mediumChallenges.length; i += 2) {
    const dcs = [mediumChallenges[i], mediumChallenges[i + 1]]
    let dcString = '<div class="row">';
    for (const dc of dcs) { dcString += cardString(dc.name, dc.image); }
    dcString += "</div>";
    dcMediumString += dcString;
  }

  for (let i = 0; i < hardChallenges.length; i += 2) {
    const dcs = [hardChallenges[i], hardChallenges[i + 1]]
    let dcString = '<div class="row">';
    for (const dc of dcs) { dcString += cardString(dc.name, dc.image); }
    dcString += "</div>";
    dcHardString += dcString;
  }

  dcEasyContainer.innerHTML += dcEasyString;
  dcMediumContainer.innerHTML += dcMediumString;
  dcHardContainer.innerHTML += dcHardString;
}

window.addEventListener("load", init);