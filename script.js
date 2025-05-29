let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        })
        .catch(error => console.error('Error loading questions:', error));

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
});

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById('question').innerText = `Câu ${questionData.id}: ${questionData.question}`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').disabled = true;
    selectedOption = null;

    for (const [key, value] of Object.entries(questionData.options)) {
        const button = document.createElement('button');
        button.className = 'option';
        button.innerText = `${key}. ${value}`;
        button.onclick = () => selectOption(button, key);
        optionsDiv.appendChild(button);
    }
}

function selectOption(button, option) {
    if (selectedOption) return;
    selectedOption = option;
    document.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    const correct = questions[currentQuestionIndex].correct;
    const feedback = document.getElementById('feedback');
    if (option === correct) {
        feedback.innerText = 'Đúng!';
        feedback.style.color = 'green';
        score++;
    } else {
        feedback.innerText = `Sai! Đáp án đúng: ${correct}. ${questions[currentQuestionIndex].options[correct]}`;
        feedback.style.color = 'red';
    }
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResult() {
    document.getElementById('quiz').style.display = 'none';
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    document.getElementById('score').innerText = `Bạn đúng ${score}/${questions.length} câu (${(score/questions.length*100).toFixed(2)}%)`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    loadQuestion();
}