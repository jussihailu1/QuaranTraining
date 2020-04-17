
// Dit zorgt ervoor dat wanneer de pagina refresht, het scroll effect blijft werken
document.scrollingElement.scrollTo(0, 0)
// Navigation

const navButtons = document.getElementsByClassName('nav-button');
const pages = document.getElementsByClassName('page');

for (const button of navButtons) {
    button.onclick = function () {
        for (const btn of navButtons) { btn.firstChild.classList.remove("active"); }
        const selectedPage = button.id.split('-')[1];
        button.firstChild.classList.add("active");
        navigatePage(selectedPage);
    }
}

function navigatePage(selectedPage) {
    for (const page of pages) {
        page.id.split('-')[2] == selectedPage ? page.hidden = false : page.hidden = true;
    }
}

// Daily challenges

const difficulty = {
    controls: {
        container: document.getElementById('difficulty-controls'),
        left: document.getElementById("difficulty-control-left"),
        right: document.getElementById("difficulty-control-right"),
        naturalPosition: 0,
        sticky: false
    },
    title: document.getElementById('tab-title'),
    levels: ["easy", "medium", "hard"],
    current: {
        name: "",
        getIndex: function () { return difficulty.levels.findIndex(difficultyName => difficulty.current.name == difficultyName); }
    },
    contents: document.getElementsByClassName('difficulty-tab-content')
}

function chooseDifficulty(difficultyName) {
    difficulty.title.innerHTML = difficultyName.toUpperCase();
    for (const content of difficulty.contents) {
        content.id.split('-')[2] == difficultyName ? content.hidden = false : content.hidden = true;
    }
}

function toggleControls() {
    difficulty.controls.left.style.visibility = difficulty.current.getIndex() == 0 ? "hidden" : "visible";
    difficulty.controls.right.style.visibility = difficulty.current.getIndex() == difficulty.levels.length - 1 ? "hidden" : "visible";
}

difficulty.controls.left.onclick = function () {
    difficulty.current.name = difficulty.levels[difficulty.current.getIndex() - 1];
    chooseDifficulty(difficulty.current.name);
    toggleControls();
}

difficulty.controls.right.onclick = function () {
    difficulty.current.name = difficulty.levels[difficulty.current.getIndex() + 1];
    chooseDifficulty(difficulty.current.name);
    toggleControls();
}

document.onscroll = function () {
    if (difficulty.controls.container.offsetTop > difficulty.controls.naturalPosition && !difficulty.controls.sticky) {
        difficulty.controls.sticky = true;
        difficulty.controls.container.classList.add("sticky");
    } else if (difficulty.controls.container.offsetTop == difficulty.controls.naturalPosition && difficulty.controls.sticky) {
        difficulty.controls.sticky = false;
        difficulty.controls.container.classList.remove("sticky");
    }
}

function initDifficulty() {
    difficulty.controls.naturalPosition = difficulty.controls.container.offsetTop;
    difficulty.current.name = difficulty.levels[0];

    toggleControls();
}

initDifficulty();
