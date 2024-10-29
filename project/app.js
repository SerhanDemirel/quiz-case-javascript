let questions = [];
let currentQuestion = 0;
let timeRemaining = 30;
let answers = [];
let timer;

const questionElement = document.getElementById("question");
const timerElement = document.getElementById("timer");
const summaryElement = document.getElementById("summary");
const resultTable = document.getElementById("resultTable");
const buttons = document.querySelectorAll(".options button");

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error("Soru yükleme hatası:", error);
    }
}

function loadQuestion() {
    clearInterval(timer);

    const questionData = questions[currentQuestion];
    questionElement.innerText = questionData.title;

    const options = questionData.body.split(" ");
    buttons.forEach((button, index) => {
        button.innerText = options[index];
        button.disabled = true;
        button.style.backgroundColor = ""; // Şıkları eski hallerine döndür
    });

    setTimeout(() => {
        buttons.forEach(button => button.disabled = false);
    }, 10000);

    timeRemaining = 30;
    startTimer();
}

function startTimer() {
    timerElement.innerText = `Süre: ${timeRemaining}`;
    
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = `Süre: ${timeRemaining}`;
        
        if (timeRemaining === 0) {
            clearInterval(timer);
            moveToNextQuestion("Cevapsız");
        }
    }, 1000);
}

function selectOption(answer) {
    clearInterval(timer); // Zamanlayıcıyı durdur
    answers.push({ question: questions[currentQuestion].title, answer: answer });
    moveToNextQuestion();
}

function moveToNextQuestion(answer = "Cevapsız") {
    // Soruya herhangi bir cevap verilmemişse "Cevapsız" olarak ekle
    if (answer === "Cevapsız" && !answers.find(ans => ans.question === questions[currentQuestion].title)) {
        answers.push({ question: questions[currentQuestion].title, answer: "Cevapsız" });
    }

    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showSummary();
    }
}

function showSummary() {
    document.getElementById("quiz").style.display = "none";
    summaryElement.style.display = "block";
    answers.forEach((ans, index) => {
        const row = resultTable.insertRow();
        row.insertCell(0).innerText = `Soru ${index + 1}`;
        row.insertCell(1).innerText = ans.answer;
    });
}

loadQuestions();
