let currentQuestionIndex = 0;
let questions = [];
let correctAnswers = 0;
let incorrectAnswers = 0;

function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
    const data = await response.json();
    const filteredCategories = ['Entertainment: Music', 'Entertainment: Film'];
    questions = data.results
      .filter(item => filteredCategories.includes(item.category) && item.difficulty !== 'hard')
      .slice(0, 10)
      .map(item => ({
        category: decodeHtmlEntities(item.category),
        question: decodeHtmlEntities(item.question),
        options: [...item.incorrect_answers, item.correct_answer].map(decodeHtmlEntities).sort(() => Math.random() - 0.5),
        answer: decodeHtmlEntities(item.correct_answer)
      }));

    displayQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

function displayQuestion() {
  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = '';

  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];

    const category = document.createElement('div');
    category.className = 'category';
    category.textContent = `Category: ${question.category}`;
    questionContainer.appendChild(category);

    const questionText = document.createElement('div');
    questionText.textContent = `Question: ${question.question}`;
    questionContainer.appendChild(questionText);

    const optionsList = document.createElement('ul');
    optionsList.className = 'options';
    question.options.forEach((option, index) => {
      const optionItem = document.createElement('li');
      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      optionInput.name = 'option';
      optionInput.value = option;
      optionInput.id = `option${index}`;
      const optionLabel = document.createElement('label');
      optionLabel.htmlFor = `option${index}`;
      optionLabel.textContent = option;
      optionItem.appendChild(optionInput);
      optionItem.appendChild(optionLabel);
      optionsList.appendChild(optionItem);
    });
    questionContainer.appendChild(optionsList);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Answer';
    submitButton.id = 'submit-button';
    submitButton.onclick = checkAnswer;
    questionContainer.appendChild(submitButton);
  } else {
    displayScore();
  }
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    const question = questions[currentQuestionIndex];
    const result = document.createElement('div');
    result.className = 'result';
    if (answer === question.answer) {
      result.textContent = 'Correct!';
      correctAnswers++;
    } else {
      result.textContent = `Wrong! The correct answer is: ${question.answer}`;
      incorrectAnswers++;
    }
    document.getElementById('question-container').appendChild(result);
    document.getElementById('next-button').style.display = 'block';
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true; // Disable the submit button
    submitButton.classList.add('disabled'); // Add disabled class for styling
    document.querySelectorAll('input[name="option"]').forEach(input => input.disabled = true); // Disable all radio buttons
  } else {
    alert('Please select an option.');
  }
}

function displayScore() {
  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: ${correctAnswers} out of ${questions.length}</p>
    <p>Correct Answers: ${correctAnswers}</p>
    <p>Incorrect Answers: ${incorrectAnswers}</p>
    <button id="restart-button">Restart Quiz</button>
  `;

  document.getElementById('restart-button').onclick = () => {
    currentQuestionIndex = 0;
    questions = [];
    correctAnswers = 0;
    incorrectAnswers = 0;
    fetchQuestions();
  };
}

document.getElementById('next-button').onclick = () => {
  currentQuestionIndex++;
  displayQuestion();
  document.getElementById('next-button').style.display = 'none';
};

fetchQuestions();
