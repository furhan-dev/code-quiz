var sections;
var state;
var timeLeft;
var viewHighscoresButtonEl;
var playAgainButtonEl;
var startButtonEl;
var timerEl;

/**
 * Hide all sections
 */
function hideAllSections() {
    // for (let i = 0; i < sections.length; i++) {
    //     hide("#" + sections[i]);
    // }

    sections.forEach(section => {
        hide("#" + section);
    });
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
 * Render a section, hide all others using 'display: none'
 * @param {string} section name of section to render
 */
function renderSection(section) {

    if (state === section) {
        return;
    }

    // hide everything else
    hideAllSections();

    // hide timer unless section is quiz
    if (section !== "quiz") {
        timerEl.hidden = true;
    }

    // disable highscores button when section is highscores
    if (section === "highscores") {
        viewHighscoresButtonEl.disabled = true;
    } else {
        viewHighscoresButtonEl.disabled = false;
    }

    // update the state
    state = section;

    // finally unhide the section we want to render
    unhide("#" + section);
}

/**
 * Render the timer based on how much time is left
 */
function renderTimeLeft() {
    if (timeLeft < 10) {
        timerEl.setAttribute("class", "timer alert alert-danger");
    } else {
        timerEl.setAttribute("class", "timer alert alert-primary");
    }
    
    timerEl.hidden = false;
    timerEl.textContent = "Timer: " + timeLeft + " seconds";
}

/**
 * Render/unhide any element, given the selector
 * Removes the 'display: none' style from element
 * @param {string} selector element, classname, or id
 */
function unhide(selector) {
    let element = document.querySelector(selector);
    let classAttr = element.getAttribute("class");

    // only unhide if hidden
    if (!classAttr.includes("hidden")) {
        return;
    }

    let split = classAttr.split("hidden");
    // remove "hidden" from class
    classAttr = split[0].trim() + " " + split[1].trim();
    element.setAttribute("class", classAttr);
}

/**
 * Callback function for 'Start Quiz' and 'Play Again' buttons
 * Starts timer, displays questions, validates answers, keeps score
 */
function startQuiz() {
    renderSection("quiz");
    timeLeft = 30;
    renderTimeLeft();

    // set time interval
    let timerInterval = setInterval(function () {
        timeLeft--;

        // when time hits zero, show done section, otherwise render time
        if (timeLeft === 0) {
            renderSection("done");
        }

        // stop timer interval if not in quiz or timeLeft is zero
        if (state !== "quiz" || timeLeft === 0) {
            clearInterval(timerInterval);
        } else {
            renderTimeLeft();
        } 
    }, 1000);

    let moreQuestions = false;
    while (moreQuestions && timeLeft > 0) {
        // Serve questions
    }
}

/**
 * Initialize code quiz
 */
function init() {

    // select elements
    viewHighscoresButtonEl =  document.querySelector(".view-highscores");
    startButtonEl = document.querySelector(".start-button");
    playAgainButtonEl = document.querySelector(".play-again");
    timerEl = document.querySelector(".timer");
    // hide timmer
    timerEl.hidden = true;

    sections = ["welcome", "quiz", "done", "highscores"];

    // add listeners
    viewHighscoresButtonEl.addEventListener("click", function(event) {
        renderSection("highscores");
    });
    playAgainButtonEl.addEventListener("click", startQuiz);
    startButtonEl.addEventListener("click", startQuiz);
}

init();