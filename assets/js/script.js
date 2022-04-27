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
    sections.forEach(section => {
        document.querySelector("#" + section).classList.add("hidden");
    });
}

/**
 * Render a section, hide all others using 'display: none'
 * @param {string} section name of section to render
 */
function renderSection(section) {
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
    document.querySelector("#" + section).classList.remove("hidden");
}

/**
 * Render the timer based on how much time is left
 */
function renderTimeLeft() {
    if (timeLeft < 10) {
        timerEl.classList.replace("alert-primary", "alert-danger");
    } else {
        timerEl.classList.replace("alert-danger", "alert-primary");
    }
    
    timerEl.hidden = false;
    timerEl.textContent = "Timer: " + timeLeft + " seconds";
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

        // when time hits zero, show done section
        if (timeLeft === 0) {
            renderSection("done");
        }

        // stop timer interval if not in quiz or timeLeft is zero, otherwise render time left
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