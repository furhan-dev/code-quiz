// array containing all section names
var sections;
// var representing current state
var current;
var timeLeft;
var score;
// var representing all questions left to ask
var questions;
// keep track of current question object
var currentQuestionObj;
var areChoicesReady;

// declare all elements that have listeners
var viewHighscoresButtonEl;
var playAgainButtonEl;
var startButtonEl;
var timerEl;
var choicesEl;
var saveScoreEl;
var saveScoreNameEl;
var clearScoresEl;

/**
 * Initialize code quiz
 * By default starts on "welcome" section
 */
function init() {

    // initialize global HTML elements
    viewHighscoresButtonEl =  document.querySelector(".view-highscores");
    startButtonEl = document.querySelector(".start-button");
    playAgainButtonEl = document.querySelector(".play-again");
    timerEl = document.querySelector(".timer");
    choicesEl = document.querySelector(".choices");
    saveScoreEl = document.querySelector(".save-score-button");
    saveScoreNameEl = document.querySelector(".save-score-name");
    clearScoresEl = document.querySelector(".clear-scores");

    // initialize global variables
    timerEl.hidden = true;
    sections = ["welcome", "quiz", "gameover", "highscores"];
    current = "welcome";
    questions = getQuestionsList();

    // add listeners
    viewHighscoresButtonEl.addEventListener("click", renderHighscores);
    playAgainButtonEl.addEventListener("click", function(event) {
        renderSection("welcome");
    });
    startButtonEl.addEventListener("click", startQuiz);
    choicesEl.addEventListener("click", function(event) {
        // ignore if target isn't a button
        if (event.target.nodeName === "BUTTON" && areChoicesReady) {
            checkAnswer(event);
        }
    });

    saveScoreNameEl.addEventListener("input", function(event) {
        if (saveScoreNameEl.value.length === 0) {
            saveScoreEl.disabled = true;
        } else {
            saveScoreEl.disabled = false;
        }
    });

    saveScoreEl.addEventListener("click", function(event) {
        event.preventDefault();
        // get existing highscores and append new score to it
        let highscores = JSON.parse(localStorage.getItem("highscores"));

        // if highscores doesn't exist, initialize it
        if (highscores == null) {
            highscores = [];
        }

        // get the name from the input field
        const inputName = saveScoreNameEl.value;

        // add an entry to the highscores array
        highscores.push(
            {
                name: inputName,
                highscore: score,
            }
        );
        localStorage.setItem("highscores", JSON.stringify(highscores));
        renderHighscores();
    });

    clearScoresEl.addEventListener("click", function(event) {
        // clear all li elements
        document.querySelector(".top-scores").innerHTML = "";
        // remove "highscores" from local storage
        localStorage.removeItem("highscores");
        renderHighscores();
    });
}

/**
 * Helper function to hide all sections
 */
function hideAllSections() {
    sections.forEach(section => {
        // adds 'hidden' class to section element, which sets 'display: none' in CSS
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

    // update the current to be the section 
    current = section;

    // unhide the section we want to render
    // this removes the 'hidden' class, hence displaying the section
    document.querySelector("#" + section).classList.remove("hidden");
}

/**
 * Callback function to render highscores
 */
function renderHighscores() {
    viewHighscoresButtonEl.disabled = true;
    timerEl.hidden = true;

    renderSection("highscores");
    const highscoresListEl = document.querySelector(".top-scores");
    // get highscores from local storage
    let highscores = JSON.parse(localStorage.getItem("highscores"));
    const listItemClasses = ["list-group-item", "d-flex", "justify-content-between", "align-items-start"];

    // if highscores exists in local storage, then render
    if (highscores != null) {
        // sort highscores array by value from high to low
        highscores.sort((a, b) => b.highscore - a.highscore);

        highscoresListEl.innerHTML = "";
        // create a badge and insert only once for a new entry into the top 5
        isBadgeAdded = false;
        const newBadgeEl = document.createElement("span");
        newBadgeEl.classList.add("badge", "bg-primary", "rounded-pill");
        newBadgeEl.textContent = "New!";
        // get the user inputted name to check if it's in top 5
        const inputName = saveScoreNameEl.value; 
        // only show up to 5 highscores
        maxScores = Math.min(highscores.length, 5);
        for (let i = 0; i < maxScores; i++) {
            // create elements and add bootstrap classes
            const listItemEl = document.createElement("li");
            listItemEl.classList.add(...listItemClasses);

            const innerDivEl = document.createElement("div");
            innerDivEl.classList.add("ms-2", "me-auto");

            const nameDivEl = document.createElement("div");
            nameDivEl.classList.add("fw-bold");
            const name = highscores[i].name;
            nameDivEl.textContent = name;

            const highscore = highscores[i].highscore;
            const scoreTextEl = document.createTextNode(highscore + " points");

            innerDivEl.appendChild(nameDivEl);
            innerDivEl.appendChild(scoreTextEl);
            listItemEl.appendChild(innerDivEl);

            // check if last quiz entered top 5
            if (!isBadgeAdded && name === inputName && highscore == score) {
               listItemEl.appendChild(newBadgeEl);
               isBadgeAdded = true;
            }
            
            //finally, add list item to highscores ol container
            highscoresListEl.appendChild(listItemEl);
        }
        // make sure clear scores button is enabled
        clearScoresEl.disabled = false;
    } else {
        // disable clear scores button as there are no scores to clear
        clearScoresEl.disabled = true;
    }

    // clear the name input after we're done
    saveScoreNameEl.value = "";
}

/**
 * Render the gameover section
 */
function renderGameover() {
    timerEl.hidden = true;
    renderSection("gameover");
    if (score >= 0) {
        // add time bonus if they finished with a positive score
        if (timeLeft >= 0) {
            score += timeLeft;
        }
    } else { 
        // prevent negative scores
        score = 0;
    }
    document.querySelector(".final-score").textContent = "You scored " + score + " points!";
    //TODO: show score calculation
}

/**
 * Render the timer based on how much time is left
 */
function renderTimeLeft() {
    // use bootstrap to change timer span background color when time runs low
    if (timeLeft < 10) {
        timerEl.classList.replace("alert-primary", "alert-danger");
    } else {
        timerEl.classList.replace("alert-danger", "alert-primary");
    }
    
    // make sure timer is visible and is updated
    timerEl.hidden = false;
    timerEl.innerText = "Timer: " + timeLeft + " seconds";
}

/**
 * Callback function for 'Start Quiz' and 'Play Again' buttons
 * Starts timer, displays questions, validates answers, keeps score
 */
function startQuiz() {
    // initialize/reset variables at start of quiz
    score = 0;
    timeLeft = 60;
    questions = getQuestionsList();
    // make sure user can click on high scores button
    viewHighscoresButtonEl.disabled = false;
    // show quiz section, timer, and update the displayed question
    renderSection("quiz");
    renderTimeLeft();
    renderQuestion();

    // set time interval
    let timerInterval = setInterval(function () {
        timeLeft--;

        // when time hits zero (or below), show gameover section
        if (timeLeft <= 0) {
            renderGameover();
        }

        // stop timer interval if not in quiz or timeLeft <= 0, otherwise render time left
        // value of 'timeLeft' can be negative since we subtract time for wrong answers
        if (current !== "quiz" || timeLeft <= 0) {
            clearInterval(timerInterval);
        } else {
            // if there is time left and we're still in quiz, update the timer element
            renderTimeLeft();
        } 
    }, 1000);
}

/**
 * Renders a random question from a list
 */
function renderQuestion() {

    if (questions.length === 0) {
        // no more questions left to ask, end game
        renderGameover();
    } else {
        areChoicesReady = true;
        // get random question
        let randomIndex = Math.floor(Math.random() * questions.length);
        // make sure to store current quesiton object to global var to access for validating answer later
        currentQuestionObj = questions.splice(randomIndex, 1)[0];

        // update the question text
        document.querySelector(".question").innerText = currentQuestionObj.question;
        // since we append to the choices div, make sure it's empty first
        choicesEl.innerHTML = "";

        // loop over all of the 'choices' and add them as button elements to the parent container div
        currentQuestionObj.choices.forEach(choice => {
            let choiceEl = document.createElement("button");
            choiceEl.innerText = choice;
            choiceEl.classList.add("btn", "btn-outline-primary");
            choicesEl.appendChild(choiceEl);
        });
    }
}

/**
 * Check user choice, give feedback via color of buttons
 * @param {object} event button click event from listener
 */
function checkAnswer(event) {

    // disable click events for choices
    areChoicesReady = false;
    // disable every button to give it a greyed out look
    disableAllChoices();
    // enable the user's choice and set it to red or green to give feedback
    event.target.disabled = false;
    if (event.target.innerText === currentQuestionObj.answer) {
        // add 10 points to score for every correct answer
        score += 10;
        event.target.classList.replace("btn-secondary", "btn-success");
    } else {
        // subtract 5 points and reduce time by 10 seconds for every incorrect answer
        score -= 5;
        timeLeft -= 10;
        event.target.classList.replace("btn-secondary", "btn-danger");
    }
    // wait a second before rendering next question so user can get feedback via button colors
    setTimeout(renderQuestion, 1000);
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
 * Get a list of question objects
 * @returns {object} array of question objects
 */
function getQuestionsList() {
    return [
        {
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
            question: "What was JavaScript originally named?",
            choices: [
                "Mocha",
                "TypeScript",
                "ECMAScript",
            ],
            answer: "Mocha",
        },
        {
            question: "When was JavaScript invented?",
            choices: [
                "1995",
                "1989",
                "1998",
            ],
            answer: "1995",
        },
        {
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
            question: 'How is the following expression evaluated in JavaScript:\n"23" === 23',
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            question: "How is the following expression evaluated in JavaScript:\n.1 + .2 !== .3",
            choices: [
                "true",
                "false",
            ],
            answer: "true",
        },
        {
            question: "How do you create a function in JavaScript?",
            choices: [
                "function foo()",
                "function:foo()",
                "function = foo()",
            ],
            answer: "function foo()",
        },
        {
            question: "JavaScript is the same as Java?",
            choices: [
                "True",
                "False",
            ],
            answer: "False",
        },
        {
            question: "When declaring a variable what's the difference between the 'let' and 'var' keywords?",
            choices: [
                "No difference",
                "'let' limits the variable scope to block statements, while 'var' doesn't",
                "let doesn't exist in JavaScript",
            ],
            answer: "'let' limits the variable scope to block statements, while 'var' doesn't",
        },
        {
            question: "Is JavaScript case-sensitive?",
            choices: [
                "Yes",
                "No",
            ],
            answer: "Yes",
        },
    ];
}

// call init to initialize quiz
init();