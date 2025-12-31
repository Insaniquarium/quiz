// Element IDs are actually already DOM element identifiers, but usage of that is discouraged
const menuNumQuestionsEl = document.getElementById("menu-num-questions");
const menuCategoryEl = document.getElementById("menu-category");
const menuStartEl = document.getElementById("menu-start");
const quizHeadingEl = document.getElementById("quiz-heading");
const quizQuestionEl = document.getElementById("quiz-question");
const quizOptionsEl = document.getElementById("quiz-options");
const quizSubmitEl = document.getElementById("quiz-submit");
const resultsMessageEl = document.getElementById("results-message");
const resultsResponsesEl = document.getElementById("results-responses");
const resultsReturnEl = document.getElementById("results-return");
const pagesEl = document.getElementById("pages");

let quiz = {};

function newQuiz(questions) {
	quiz.question = 0;
	quiz.questions = questions;
	quiz.responses = [];
}

function getSelectedDifficulty() {
	return document.querySelector('#menu input[name=menu-difficulty]:checked').value;
}

async function startQuiz() {
	const category = menuCategoryEl.value;
	const difficulty = getSelectedDifficulty();
	const numQuestions = Number(menuNumQuestionsEl.value);
	const questions = await fetchQuestionsByMenuID(category, difficulty, numQuestions);
	newQuiz(questions);
	showQuestion(quiz.question);
	changePage("quiz");
}

function createOptionElement(answer, index) {
	let input = document.createElement("input");
	input.type = "radio";
	input.name = "quiz-option";
	input.dataset.id = index;

	let span = document.createElement("span");
	span.innerHTML = answer.text;

	let label = document.createElement("label");
	label.append(input);
	label.append(span);

	return label;
}

function showQuestion(index) {
	const question = quiz.questions[index];

	quizHeadingEl.innerText = `Question ${index + 1} of ${quiz.questions.length}`;
	quizQuestionEl.innerHTML = question.question;
	clearChildren(quizOptionsEl);

	let options = question.answers.map((answer, i) => createOptionElement(answer, i));
	shuffleArray(options);
	options.forEach(e => quizOptionsEl.append(e));
}

function gatherResponse() {
	const checked = quizOptionsEl.querySelector(":checked");
	return checked ? Number(checked.dataset.id) : undefined;
}

function onSubmit() {
	quiz.responses.push(gatherResponse());
	nextQuestion();
}

function nextQuestion() {
	if (quiz.question < quiz.questions.length - 1) {
		showQuestion(++quiz.question);
	} else {
		showResults();
	}
}

function createResultElement(index, question, response) {
	let container = document.createElement("div");

	let questionText = document.createElement("p");
	questionText.className = "results-question";
	questionText.innerHTML = `${index + 1}. ${question.question}`;
	container.append(questionText);

	question.answers.forEach((answer, i) => {
		let input = document.createElement("input");
		input.type = "radio";
		input.checked = i == response;
		
		let text = document.createElement(answer.correct ? "strong" : "span");
		text.innerHTML = answer.text;

		let label = document.createElement("label");
		label.append(input);
		label.append(text);

		container.append(label);
	});

	let resultText = document.createElement("p");

	if (question.answers[response]?.correct) {
		resultText.className = "text-correct";
		resultText.innerText = "You answered correctly."
	} else {
		resultText.className = "text-incorrect";
		resultText.innerText = "You answered incorrectly."
	}

	container.append(resultText);
	return container;
}

function getScore() {
	let score = 0;
	quiz.questions.forEach((question, i) => {
		if (question.answers[quiz.responses[i]]?.correct) {
			score++;
		}
	});
	return score;
}

function showResults() {
	const score = getScore();
	const total = quiz.questions.length;

	if (score == total) {
		resultsMessageEl.innerText = `You scored ${score} out of ${total} questions! Well done!`;
	} else {
		resultsMessageEl.innerText = `You scored ${score} out of ${total} questions.`;
	}
	
	clearChildren(resultsResponsesEl);

	for (let i = 0; i < quiz.questions.length; i++) {
		resultsResponsesEl.append(createResultElement(i, quiz.questions[i], quiz.responses[i]));
	}

	changePage("results");
}

function changePage(id) {
	pagesEl.querySelectorAll(".visible").forEach(e => e.classList.remove("visible"));
	pagesEl.querySelector("#" + id)?.classList.add("visible");
}

menuStartEl.onclick = startQuiz;
quizSubmitEl.onclick = onSubmit;
resultsReturnEl.onclick = () => { changePage("menu"); };
