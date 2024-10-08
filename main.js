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
  questions = [];

  try {
    const response1 = await fetch('https://opentdb.com/api.php?amount=50&type=multiple&category=11');
    const data1 = await response1.json();

    // Wait for 5 seconds before sending the next request
    await new Promise(resolve => setTimeout(resolve, 5000));

    const response2 = await fetch('https://opentdb.com/api.php?amount=50&type=multiple&category=12');
    const data2 = await response2.json();

    const combinedResults = [...data1.results, ...data2.results];

    questions = combinedResults
      .filter(item => item.difficulty !== 'hard')
      .sort(() => Math.random() - 0.5) // Shuffle the questions
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
  // Change the h1 title to "results"
  document.querySelector('h1').textContent = 'Results';

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
    // Change the h1 title back to the original title
    document.querySelector('h1').textContent = 'Film & Music trivia';
    fetchQuestions();
  };
}

document.getElementById('next-button').onclick = () => {
  currentQuestionIndex++;
  displayQuestion();
  document.getElementById('next-button').style.display = 'none';
};

fetchQuestions();
