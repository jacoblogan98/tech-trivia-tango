//Home Page
const homeDiv = document.querySelector('#home-div');
const gameDiv = document.querySelector('#game');
const hofDiv = document.querySelector('#hall-of-fame');

const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', () => {
    getQ();
    numSpan = 1;
    homeDiv.classList.add('hidden');
    gameDiv.classList.remove('hidden');
})

const hofBtn = document.querySelector('#hall-of-fame-btn');
hofBtn.addEventListener('click', () => {
    homeDiv.classList.add('hidden');
    hofDiv.classList.remove('hidden');
    hofForm.classList.add('hidden');
    replayBtn.classList.add('hidden');
})

//Game Page
const BASE_URL = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';
function getQ() {
    fetch(BASE_URL)
    .then(resp => resp.json())
    .then(data => {
        const questions = data.results;
        renderQ(questions);
    })
}

const qnaDiv = document.querySelector('#qna-container');

let numSpan = 1;
let wrongAns = 0;

function renderQ(questions) {
    questions.forEach(question => {
        qnaDiv.textContent = "";

        filterQuestions(question)


        const correct = question.correct_answer;
        const currentQ = question;

        let randAnswers = [];
        randomizeAns(question, randAnswers);

        const ansDiv = document.createElement('div');
            ansDiv.id = "answer-container";

        const h2 = document.createElement('h2');
            h2.textContent = `Question ${numSpan}/10`;
            h2.id = "#question-progress";

        const h3 = document.createElement("h3");
            h3.textContent = question.question;
            h3.id = 'question';

        const a1 = document.createElement("button");
            a1.textContent = randAnswers[0];
            a1.id = 'a1';
            a1.classList.add('answer', 'btn');

        const a2 = document.createElement("button");
            a2.textContent = randAnswers[1];
            a2.id = 'a2';
            a2.classList.add('answer', 'btn');

        const a3 = document.createElement("button");
            a3.textContent = randAnswers[2];
            a3.id = 'a3';
            a3.classList.add('answer', 'btn');

        const a4 = document.createElement("button");
            a4.textContent = randAnswers[3];
            a4.id = 'a4';
            a4.classList.add('answer', 'btn');

        const answers = [a1, a2, a3, a4];

        clickAns(answers, correct, questions, currentQ);

        ansDiv.append(a1, a2, a3, a4);
        qnaDiv.append(h2, h3, ansDiv);
    })  
}


function filterQuestions(unfilteredQuestions) {
    //console.log(unfilteredQuestions)
    
    const ap1 = () => {
        const filteredQ = unfilteredQuestions.question.replace(/&#039;/g, "'")
        const filteredCorrA = unfilteredQuestions.correct_answer.replace(/&#039;/g, "'")
        const filteredA = unfilteredQuestions.incorrect_answers.map(answer => answer.replace(/&#039;/g, "'"))

        unfilteredQuestions.question = filteredQ;
        unfilteredQuestions.correct_answer = filteredCorrA;
        unfilteredQuestions.incorrect_answers = filteredA
    }

    const ap2 = () => {
        const filteredQ = unfilteredQuestions.question.replace(/&quot;/g, "'")
        const filteredCorrA = unfilteredQuestions.correct_answer.replace(/&quot;/g, "'")
        const filteredA = unfilteredQuestions.incorrect_answers.map(answer => answer.replace(/&quot;/g, "'"))

        unfilteredQuestions.question = filteredQ;
        unfilteredQuestions.correct_answer = filteredCorrA;
        unfilteredQuestions.incorrect_answers = filteredA
    }

    const lt = () => {
        const filteredQ = unfilteredQuestions.question.replace(/&lt;/g, "<")
        const filteredCorrA = unfilteredQuestions.correct_answer.replace(/&lt;/g, "<")
        const filteredA = unfilteredQuestions.incorrect_answers.map(answer => answer.replace(/&lt;/g, "<"))

        unfilteredQuestions.question = filteredQ;
        unfilteredQuestions.correct_answer = filteredCorrA;
        unfilteredQuestions.incorrect_answers = filteredA
    }
    
    const gt = () => {
        const filteredQ = unfilteredQuestions.question.replace(/&gt;/g, ">")
        const filteredCorrA = unfilteredQuestions.correct_answer.replace(/&gt;/g, ">")
        const filteredA = unfilteredQuestions.incorrect_answers.map(answer => answer.replace(/&gt;/g, ">"))

        unfilteredQuestions.question = filteredQ;
        unfilteredQuestions.correct_answer = filteredCorrA;
        unfilteredQuestions.incorrect_answers = filteredA
    }

    ap1()
    ap2()
    lt();
    gt();
}


function randomizeAns(question, randAnswers) {
    randAnswers.push(...question.incorrect_answers, question.correct_answer);

    for (let i = randAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randAnswers[i], randAnswers[j]] = [randAnswers[j], randAnswers[i]];
    }
}

function clickAns(answers, correct, questions, currentQ) {
    console.log(correct);
    answers.forEach(answer => {
        answer.addEventListener('click', () => {    
            if (answer.textContent === correct) {
            console.log('Correct!');
            
            changeQ(currentQ, questions);
        } else {
            answer.disabled = true;
            answer.classList.add('incorrect');

            gameOver();
            console.log('Incorrect!');
        }
        });
    });
}

function changeQ(currentQ, questions) {
    const updatedQ = questions.filter(question => question.question !== currentQ.question);

    if (updatedQ.length > 0) { 
        numSpan++;
        renderQ(updatedQ);
    } else {
        numSpan = 1;
        gameDiv.classList.add('hidden');
        hofDiv.classList.remove('hidden');
        hofForm.classList.remove('hidden');
        replayBtn.classList.remove('hidden');
    }
}

const gameOverDiv = document.querySelector('#game-over');

function gameOver() {
    if (wrongAns < 2) {
        wrongAns++;
    } else {
        wrongAns = 0;
        gameDiv.classList.add('hidden');
        gameOverDiv.classList.remove('hidden');
    }
}

//Hall of Fame page
const hofForm = document.querySelector('#hof-form');
const hofTxt = document.querySelector('#hof-submit');
const lbList = document.querySelector('#leaderboard');
const homeBtn = document.querySelector('#home');
const replayBtn = document.querySelector('#replay');
const dbURL = 'http://localhost:3000/posts';

fetch(dbURL)
.then(resp => resp.json())
.then(winners => {
    winners.forEach(winner => {
        const li = document.createElement('li');
        li.textContent = winner.name

        lbList.append(li)
    })
})

hofForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const winner = document.createElement('li');
    winner.textContent = hofTxt.value;

    storeWinner(winner.textContent);

    lbList.append(winner);
    hofForm.reset();
})

function storeWinner(winner) {
    console.log(winner);
    
    const congfigObj = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json'
        },
        body: JSON.stringify({
            name: winner
        })
    };

    console.log(congfigObj);

    fetch(dbURL, congfigObj)
    .then(resp => resp.json())
    .then(winner => {
        console.log(winner);
    })
}

homeBtn.addEventListener('click', () => {
    homeDiv.classList.remove('hidden');
    gameDiv.classList.add('hidden');
    hofDiv.classList.add('hidden');
})

replayBtn.addEventListener('click', () => {
    getQ();
    gameDiv.classList.remove('hidden');
    hofDiv.classList.add('hidden');
})

//Game Over page
const giveUpBtn = document.querySelector('#give-up');
    giveUpBtn.addEventListener('click', () => {
        gameOverDiv.classList.add('hidden');
        homeDiv.classList.remove('hidden');
    })

const retryBtn = document.querySelector('#retry');
    retryBtn.addEventListener('click', () => {
        getQ();
        numSpan = 1;
        gameOverDiv.classList.add('hidden');
        gameDiv.classList.remove('hidden');
    })

