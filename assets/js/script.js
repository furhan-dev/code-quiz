var viewHighscoresLink;
var sections;
var current;
var previous;

/**
 * Hide all sections
 */
function hideAllSections() {
    for (let i = 0; i < sections.length; i++) {
        hideSection(sections[i]);
    }
}

/**
 * Hides a section
 * @param {string} section name of section to hide
 */
function hideSection(section) {
    let element = document.querySelector("#" + section);
    let classAttr = element.getAttribute("class");

    // if class attribute doesn't exist, initialize it to empty string
    if (!classAttr) {
        classAttr = "";
    }

    // add hidden to class attribute if it's not already there
    if (!classAttr.includes("hidden")) {
        classAttr += " hidden";
        element.setAttribute("class", classAttr.trim());
    }
}

/**
 * Show a section, hide all others
 * @param {string} section name of section to show
 */
function showSection(section) {
    if (current === section) {
        return;
    }

    hideAllSections();
    // update the state
    previous = current;
    current = section;

    let element = document.querySelector("#" + section);
    let classAttr = element.getAttribute("class");

    let split = classAttr.split("hidden");
    // remove "hidden" from class
    classAttr = split[0].trim() + " " + split[1].trim();
    element.setAttribute("class", classAttr);
}

/**
 * Initialize code quiz
 */
function init() {

    // select elements
    viewHighscoresLink =  document.querySelector(".view-highscores");
    backButton = document.querySelector(".back");

    // init quiz state
    current = "start";
    previous = "start"; 
    sections = ["start", "quiz", "done", "highscores"];

    // add listeners
    viewHighscoresLink.addEventListener("click", function(event) {
        showSection("highscores");
    });

    backButton.addEventListener("click", function(event) {
        showSection(previous);
    });
}

init();