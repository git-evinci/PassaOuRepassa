let questionsArray = []; // Global variable to store the questions
let currentCorrectAnswer = ""; // Global variable to store the current correct answer
let currentChoice = 0; // Tracks the current choice
let resultGame = ""; // Global variable to store if the contestant won or lost

const choices = ["#choice-1", "#choice-2", "#choice-3"];

// Function to load the JSON file and return the questions array
async function loadJsonFile() {
  try {
    const response = await fetch("questions.json"); // Replace with correct path to JSON file
    if (!response.ok) throw new Error("Failed to load the file");
    const data = await response.json();
    questionsArray = data;
    return data;
  } catch (error) {
    console.error("Error loading JSON file:", error);
    return [];
  }
}
// algorithm to shuffle the choices array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to pick a random question, shuffle its choices, and remove it from the global questionsArray
function getRandomQuestion() {
  if (questionsArray.length === 0) {
    console.warn("The questions array is empty");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * questionsArray.length);
  const randomQuestion = questionsArray[randomIndex];
  questionsArray.splice(randomIndex, 1); // Remove the question from the array
  randomQuestion.choices = shuffleArray(randomQuestion.choices);
  currentCorrectAnswer = randomQuestion.correct_answer; // Store the correct answer for comparison
  updateRemainingQuestions();
  return randomQuestion;
}

// Function to update the questions left counter
function updateRemainingQuestions() {
  const remainingQuestions = questionsArray.length;
  console.log(`Perguntas restantes: ${remainingQuestions}`);
}

function clearScreen() {
    currentChoice = 0;
    resultGame = "";
    updateScore("scoreGreenValue");
    updateScore("scoreBlueValue");
    let leftBracket = document.querySelector(".left-bracket");
    let rightBracket = document.querySelector(".right-bracket");
    let questionContainer = document.querySelector(".question-container");
    let choiceContainers = document.querySelectorAll(".choice-container");
  
    leftBracket.remove();
    rightBracket.remove();
    questionContainer.remove();
    choiceContainers.forEach((container) => {
      container.remove();
    });
}
function load_question() {
    let testBracket = document.querySelector(".left-bracket");
    if (testBracket) {
        clearScreen();
    }

  const randomQuestion = getRandomQuestion();
  if (!randomQuestion) {
    console.error("No questions available to display.");
    loadJsonFile();
    return;
  }
  leftBracket = document.createElement("div");
  leftBracket.className = "left-bracket";
  rightBracket = document.createElement("div");
  rightBracket.className = "right-bracket";
  questionText = document.createElement("h2");
  questionText.className = "question-text";
  questionText.textContent = randomQuestion.question;
  // Append the new h2 element to the question container
  questionContainer = document.createElement("div");
  questionContainer.className = "question-container";
  questionContainer.appendChild(questionText);

  document.body.appendChild(leftBracket);
  document.body.appendChild(rightBracket);
  document.body.appendChild(questionContainer);
  randomQuestion.choices.forEach((choice, index) => {
    choiceContainer = document.createElement("div");
    choiceContainer.className = "choice-container";
    choiceContainer.id = `choice-${index + 1}`;
    radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "choice";
    radioInput.id = `input-choice-${index + 1}`;
    radioInput.value = choice;
    label = document.createElement("label");
    label.setAttribute("for", `input-choice-${index + 1}`);
    label.textContent = choice;
    choiceContainer.appendChild(radioInput);
    choiceContainer.appendChild(label);
    document.body.appendChild(choiceContainer);
  });
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="choice"]:checked');

  if (!selectedOption) {
    //alert("Por favor, selecione uma resposta!");
    console.log("Por favor, selecione uma resposta!");
    return;
  }

  const selectedChoice = selectedOption.value;
  console.log(selectedChoice);

  // Clear previous styling and remove checked styles
  document.querySelectorAll(".choice-container label").forEach((label) => {
    label.classList.remove("correct", "incorrect");
    label.style.backgroundColor = "";
    label.style.color = "";
  });
  console.log(currentCorrectAnswer);
  // Apply styles based on correctness
  if (selectedChoice === currentCorrectAnswer) {
    selectedOption.nextElementSibling.classList.add("correct");
    resultGame = "won";
  } else {
    resultGame = "lost";
    selectedOption.nextElementSibling.classList.add("incorrect");
    const correctOption = [
      ...document.querySelectorAll('input[name="choice"]'),
    ].find((input) => input.value === currentCorrectAnswer);

    if (correctOption) {
      correctOption.nextElementSibling.classList.add("correct");
    }
  }

  // Update the scores on the page
  //updateTeamScores();

  // Disable all radio buttons after checking the answer
  document.querySelectorAll('input[name="choice"]').forEach((input) => {
    input.disabled = true;
  });

  selectedOption.checked = false; // Uncheck the selected option
}

function updateScore(idColorScore) {
  mark = ``;
  document.getElementById("scoreBlueValue").innerHTML = mark;
  document.getElementById("scoreGreenValue").innerHTML = mark;
  switch (resultGame) {
    case "won":
      mark = `<svg width="120.499" height="80.384" viewBox="0 0 31.882 21.268" xmlns="http://www.w3.org/2000/svg"><path d="m0 0-15.415 27.809-14.425-14.515 24.361-42.407L8.8-16.54l.263-.282 51.471 47.997Z" style="fill:#009c5f;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.35278 0 0 -.35278 10.527 10.998)"/></svg>`;
      break;
    case "lost":
      mark = `<svg width="60" height="59.999" viewBox="0 0 15.875 15.875" xmlns="http://www.w3.org/2000/svg"><path d="M15.875 12.382 11.43 7.937l4.445-4.445L12.383 0 7.938 4.445 3.493 0 0 3.492l4.445 4.445L0 12.382l3.493 3.493 4.445-4.445 4.445 4.445z" style="fill:red;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:.248825"/></svg>`;
      break;
    default:
  }
  document.getElementById(idColorScore).innerHTML = mark;
}
// Function to handle choice selection
function selectChoice(choiceIndex) {
  // Reset all choices to default (no checked radio button)
  choices.forEach((choice) => {
    document.querySelector(choice).querySelector("input").checked = false;
  });

  // Check the selected choice
  const selectedChoice = document
    .querySelector(choices[choiceIndex])
    .querySelector("input");
  selectedChoice.checked = true;

  // Move to the next choice in the cycle
  currentChoice = (choiceIndex + 1) % choices.length;
}

// Attach event listeners to labels for click interactions
choices.forEach((choice, index) => {
  const label = document.querySelector(choice).querySelector("label");
  label.addEventListener("click", () => selectChoice(index));
});

// Optionally, you can keep cycling through choices using a timer
function cycleChoices() {
  selectChoice(currentChoice);
}
function updateScore(idColorScore) {
  mark = ``;
  document.getElementById("scoreBlueValue").innerHTML = mark;
  document.getElementById("scoreGreenValue").innerHTML = mark;
  switch (resultGame) {
    case "won":
      mark = `<svg width="120.499" height="80.384" viewBox="0 0 31.882 21.268" xmlns="http://www.w3.org/2000/svg"><path d="m0 0-15.415 27.809-14.425-14.515 24.361-42.407L8.8-16.54l.263-.282 51.471 47.997Z" style="fill:#009c5f;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.35278 0 0 -.35278 10.527 10.998)"/></svg>`;
      break;
    case "lost":
      mark = `<svg width="85.068" height="85.067" viewBox="0 0 22.508 22.507" xmlns="http://www.w3.org/2000/svg"><path d="m0 0-17.864 17.864L0 35.728l-14.036 14.036L-31.9 31.9l-17.864 17.864L-63.8 35.728l17.864-17.864L-63.801 0l14.036-14.036L-31.9 3.828l17.864-17.864Z" style="fill:red;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.35278 0 0 -.35278 22.508 17.556)"/></svg>`;
      break;
    default:
  }
  document.getElementById(idColorScore).innerHTML = mark;
}
let countdownInterval;
let timeLeft = 5000; // Initialize to 5000 milliseconds (5 seconds)

function updateTimerDisplay() {
  const timerElement = document.getElementById("timer");
  const totalMilliseconds = timeLeft;
  const seconds = Math.floor(totalMilliseconds / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // Convert to tenths of a second

  // Format seconds and milliseconds to always show two digits
  timerElement.textContent = `${seconds
    .toString()
    .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
}

function reset_timer() {
  clearInterval(countdownInterval); // Clear any existing timer

  timeLeft = 5000; // Reset to 5000 milliseconds (5 seconds)
  updateTimerDisplay(); // Update display immediately

  countdownInterval = setInterval(() => {
    timeLeft -= 10; // Decrease by 10ms

    if (timeLeft <= 0) {
      clearInterval(countdownInterval); // Stop the timer when it reaches 0
      timeLeft = 0; // Set to 0 to avoid negative values
    }

    updateTimerDisplay(); // Update display
  }, 10); // Update every 10ms
}

// Event listener for the reset button
//document.getElementById('reset-timer-btn').addEventListener('click', reset_timer);
// When the page loads, load the JSON file and update counter
window.onload = async function () {
    await loadJsonFile();  // Load questions
    updateRemainingQuestions();  // Initialize the remaining questions count
    clearScreen();
}

// Initialize the timer display when the page loads
updateTimerDisplay();
