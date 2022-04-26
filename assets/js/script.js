var viewHighscoresLink;
var sections;
var current;
var previous;
var backButton;
var startButton;
var timer;

/**
 * Hide all sections
 */
function hideAllSections() {
    for (let i = 0; i < sections.length; i++) {
        hide("#" + sections[i]);
    }
}

/**
 * Hide an element given the selector
 * @param {string} selector element to hide
 */
function hide(selector) {
    let element = document.querySelector(selector);
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
 * Render a section, hide all others
 * @param {string} section name of section to render
 */
function renderSection(section) {
    if (current === section) {
        return;
    }

    // hide everything else
    hideAllSections();
    // also hide timer if user isn't in the quiz section
    if (section !== "quiz") {
        hide(".timer");
    }

    // update the state
    previous = current;
    current = section;

    unhide("#" + section);
}

/**
 * Render/unhide any element, given the selector 
 * @param {string} selector element, classname, or id
 */
function unhide(selector) {
    let element = document.querySelector(selector);
    let classAttr = element.getAttribute("class");

    let split = classAttr.split("hidden");
    // remove "hidden" from class
    classAttr = split[0].trim() + " " + split[1].trim();
    element.setAttribute("class", classAttr);
}

function startQuiz() {
    renderSection("quiz");
    unhide(".timer");
    timer = 30;
    
    // set time interval

    // update timer element color when 10 seconds left

    // end quiz if time runs out or no more questions left
}

/**
 * Initialize code quiz
 */
function init() {

    // select elements
    viewHighscoresLink =  document.querySelector(".view-highscores");
    startButton = document.querySelector(".start-button");
    backButton = document.querySelector(".back");

    // init quiz state
    current = "start";
    previous = "start"; 
    sections = ["start", "quiz", "done", "highscores"];
    timer = 0;

    // add listeners
    viewHighscoresLink.addEventListener("click", function(event) {
        renderSection("highscores");
    });

    backButton.addEventListener("click", function(event) {
        // don't allow user to go back to quiz
        if (previous === "quiz") {
            renderSection("start");
        } else {
            renderSection(previous);
        }
    });

    startButton.addEventListener("click", startQuiz);
}

init();