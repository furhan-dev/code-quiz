var sections;
var current;
var timeLeft;
var score;
var questions;

var viewHighscoresButtonEl;
var playAgainButtonEl;
var startButtonEl;
var timerEl;
var questionEl;
var choicesEl;

/**
 * Helper function to hide all sections
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

    // update the current section 
    current = section;

    // unhide the section we want to render
    document.querySelector("#" + section).classList.remove("hidden");
}

/**
 * Callback function to render highscores
 */
function renderHighscores() {
    viewHighscoresButtonEl.disabled = true;
    timerEl.hidden = true;
    renderSection("highscores");
}

/**
 * Render the gameover section
 */
function renderGameover() {
    timerEl.hidden = true;
    renderSection("gameover");
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
    score = 0;
    timeLeft = 30;
    viewHighscoresButtonEl.disabled = false;
    renderSection("quiz");
    renderTimeLeft();
    initQuestions();
    renderQuestion();

    // set time interval
    let timerInterval = setInterval(function () {
        timeLeft--;

        // when time hits zero, show gamover section
        if (timeLeft === 0) {
            renderGameover();
        }

        // stop timer interval if not in quiz or timeLeft is zero, otherwise render time left
        if (current !== "quiz" || timeLeft === 0) {
            clearInterval(timerInterval);
        } else {
            renderTimeLeft();
        } 
    }, 1000);
}

function renderQuestion() {
    if (questions.length === 0) {
        renderGameover();
    }

    // get random question
    let randomIndex = Math.floor(Math.random() * questions.length);
    let questionObj = questions.splice(randomIndex, 1)[0];

    // update the question text
    questionEl.textContent = questionObj.question;
    // set the question index, so we know how to lookup answer later
    choicesEl.innerHTML = "";
    choicesEl.setAttribute("data-question-index", questionObj.index)

    questionObj.choices.forEach(choice => {
        let choiceEl = document.createElement("button");
        choiceEl.innerText = choice;
        choiceEl.classList.add("btn", "btn-outline-primary");
        choicesEl.appendChild(choiceEl);
    });
}

/**
 * Initialize code quiz
 * By default starts on "welcome" section
 */
function init() {

    // select elements
    viewHighscoresButtonEl =  document.querySelector(".view-highscores");
    startButtonEl = document.querySelector(".start-button");
    playAgainButtonEl = document.querySelector(".play-again");
    timerEl = document.querySelector(".timer");
    questionEl = document.querySelector(".question");
    choicesEl = document.querySelector(".choices");

    // hide timmer in 'welcome' section
    timerEl.hidden = true;
    current = "welcome";
    sections = ["welcome", "quiz", "gameover", "highscores"];

    // add listeners
    viewHighscoresButtonEl.addEventListener("click", renderHighscores);
    playAgainButtonEl.addEventListener("click", startQuiz);
    startButtonEl.addEventListener("click", startQuiz);
}

function initQuestions() {
    questions = [
        {
            index: 0,
            question: "Who is considered the first computer programmer?",
            choices: [
                "Ada Lovelace",
                "Alan Turing",
                "Bill Gates",
                "Donald Knuth",
            ],
            answer: "Ada Lovelace",
        },
        {
            index: 1,
            question: "What was Javascript originally named?",
            choices: [
                "Mocha",
                "TypeScript",
                "ECMAScript",
            ],
            answer: "Mocha",
        },
        {
            index: 2,
            question: "When was Javascript invented?",
            choices: [
                "1995",
                "1989",
                "1998"
            ],
            answer: "1995",
        },
    ];
}

init();
