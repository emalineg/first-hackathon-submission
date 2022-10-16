function playCSGame(){
    document.getElementById("creditScoreGame").style.visibility = "visible";
    document.getElementById("morgCalcTwo").style.visibility = "visible";
    document.getElementById("creditScoreDesc").style.visibility = "hidden";
}

const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const scoreText = document.querySelector('#score');
const MorgButtTwo = document.querySelector('#MorgCalcTwo')

let answerSubmitted = false;
let currentQuestion = {};
let acceptingAnswers = true;
let score = 690;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: 'Do you open a lot of credit cards?',
        choice1: 'Yes',
        choice2: 'No',
        answer: 2 // answer means that this is the best choice to make 
    },
    {
        question: 'Do you miss paying your credit card bill on time so that you can...?',
        choice1: 'Yes',
        choice2: 'No',
        answer: 2 // answer means that this is the best choice to make 
    },
    {
        question: 'Do you have a long history of paying bills?',
        choice1: 'Yes',
        choice2: 'No',
        answer: 1 // answer means that this is the best choice to make 
    }
]

const SCORE_POINTS = 20;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 690;
    availableQuestions = [...questions];
    getNewQuestion();
}

document.addEventListener("DOMContentLoaded", function(event) { 
    let scoreText = document.querySelector('#score');
    let scoreInt = parseInt(scoreText.innerHTML);

    function increaseFICOScore() { 
        if (!answerSubmitted) {        
            scoreText.innerHTML = scoreInt += 15;
        }
        submitAnswer();
    }
    
    function decreaseFICOScore() { 
        if (!answerSubmitted) {
            scoreText.innerHTML = scoreInt -= 15;
        }
        submitAnswer();
    }

    function submitAnswer() { 
        answerSubmitted = true;
    }

    const creditChoice1A = document.getElementById("creditChoice1A");
    console.log(creditChoice1A);
    if (creditChoice1A) {
        creditChoice1A.addEventListener(
            'click',
            increaseFICOScore
        );
    }

    const creditChoice1B = document.getElementById("creditChoice1B");
    if (creditChoice1B) {
        creditChoice1B.addEventListener(
            'click',
            decreaseFICOScore
        );
    }
});
