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
    // add time bonus if they finished with a positive score
    if (score > 0) {
        score += timeLeft;
    }
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
    questions = getQuestionsList();
    viewHighscoresButtonEl.disabled = false;
    renderSection("quiz");
    renderTimeLeft();
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

/**
 * Renders a random question from a list
 */
function renderQuestion() {
    // while more questions exist, keep rendering new questions
    if (questions.length === 0) {
        renderGameover();
    } else {
        // get random question
        let randomIndex = Math.floor(Math.random() * questions.length);
        let questionObj = questions.splice(randomIndex, 1)[0];

        // update the question text
        questionEl.innerText = questionObj.question;
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
}

/**
 * Check user choice, give feedback via color of buttons
 * @param {object} choice button picked by user
 */
async function checkAnswer(choice) {

    // get the index of the question, then get the answer from question list
    let questionIndex = choicesEl.getAttribute("data-question-index");
    let correctAnswer = getQuestionsList()[questionIndex].answer;


    disableAllChoices();
    choice.disabled = false;
    if (choice.innerText === correctAnswer) {
        score += 10;
        choice.classList.replace("btn-secondary", "btn-success");
    } else {
        score -= 10;
        choice.classList.replace("btn-secondary", "btn-danger");
    }
    // set async wait so user gets feedback from buttons
    await new Promise(r => setTimeout(r, 1000));
    renderQuestion();
}

/**
 * Helper to make all choice buttons appear disabled
 */
function disableAllChoices() {
    let allButtons = choicesEl.children;
    for (var i = 0; i < allButtons.length; i++) {
        let button = allButtons[i];
        button.classList.replace("btn-outline-primary", "btn-secondary");
        allButtons[i].disabled = true;
    }
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
    questions = getQuestionsList();

    // add listeners
    viewHighscoresButtonEl.addEventListener("click", renderHighscores);
    playAgainButtonEl.addEventListener("click", startQuiz);
    startButtonEl.addEventListener("click", startQuiz);
    choicesEl.addEventListener("click", function(event) {
        // ignore if target isn't a button
        if (event.target.nodeName === "BUTTON") {
            checkAnswer(event.target);
        }
    });
}

/**
 * Get a list of question objects
 * @returns {Array} list of question objects
 */
function getQuestionsList() {
    return [
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
            question: "What was JavaScript originally named?",
            choices: [
                "Mocha",
                "TypeScript",
                "ECMAScript",
            ],
            answer: "Mocha",
        },
        {
            index: 2,
            question: "When was JavaScript invented?",
            choices: [
                "1995",
                "1989",
                "1998",
            ],
            answer: "1995",
        },
        {
            index: 3,
            question: 'How is the following expression evaluated in JavaScript:\n"2" + "2" - "2"',
            choices: [
                '"2"',
                '"20"',
                "2",
                "20",
            ],
            answer: "20",
        },
        {
            index: 4,
            question: 'How is the following expression evaluated in JavaScript:\n"23" === 23',
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            index: 5,
            question: "How is the following expression evaluated in JavaScript:\n.1 + .2 !== .3",
            choices: [
                "true",
                "false",
            ],
            answer: "true",
        },
        {
            index: 6,
            question: "How do you create a function in JavaScript?",
            choices: [
                "function foo()",
                "function:foo()",
                "function = foo()",
            ],
            answer: "function foo()",
        },
        {
            index: 7,
            question: "JavaScript is the same as Java?",
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            index: 8,
            question: "When declaring a variable what's the difference between the 'let' and 'var' keywords?",
            choices: [
                "No difference",
                "'let' limits the variable scope to block statements, while 'var' doesn't",
                "let doesn't exist in JavaScript",
            ],
            answer: "'let' limits the variable scope to block statements, while 'var' doesn't",
        },
        {
            index: 9,
            question: "Is JavaScript case-sensitive?",
            choices: [
                "Yes",
                "No",
            ],
            answer: "Yes",
        },
    ];
}

init();