// Element IDs are actually already DOM element identifiers, but usage of that is discouraged
const menuNumQuestionsEl = document.getElementById("menu-num-questions");
const menuCategoryEl = document.getElementById("menu-category");
const menuDifficultyEl = document.getElementById("menu-difficulty");
const menuStartEl = document.getElementById("menu-start");
const quizHeadingEl = document.getElementById("quiz-heading");
const quizQuestionEl = document.getElementById("quiz-question");
const quizOptionsEl = document.getElementById("quiz-options");
const quizSubmitEl = document.getElementById("quiz-submit");

const defaultQuestions = [
	{
		question: "yay or nay?",
		answers: [
			{ text: "yay", correct: true },
			{ text: "nay", correct: false },
			{ text: "may", correct: false }
		]
	},
	{
		question: "foo or bar?",
		answers: [
			{ text: "foo", correct: true },
			{ text: "bar", correct: false },
			{ text: "baz", correct: false }
		]
	},
];

let quiz = {};

function newQuiz(questions) {
	quiz.question = 0;
	quiz.questions = questions;
	quiz.responses = [];
}

function startQuiz() {
	newQuiz(defaultQuestions);
	showQuestion(quiz.question);
}

function createOptionElement(answer, id) {
	let input = document.createElement("input");
	input.type = "radio";
	input.name = "quiz-option";
	input.dataset.id = id;

	let span = document.createElement("span");
	span.innerText = answer.text;

	let label = document.createElement("label");
	label.append(input);
	label.append(span);

	return label;
}

function showQuestion(index) {
	const question = quiz.questions[index];

	quizHeadingEl.innerText = `Question ${index + 1} of ${quiz.questions.length}`;
	quizQuestionEl.innerText = question.question;
	clearChildren(quizOptionsEl);

	let options = question.answers.map((answer, i) => createOptionElement(answer, i));
	shuffleArray(options);
	options.forEach(e => quizOptionsEl.append(e));
}

function showResults() {

}

function onSubmit() {
	nextQuestion();
}

function nextQuestion() {
	if (quiz.question < quiz.questions.length - 1) {
		showQuestion(++quiz.question);
	} else {
		showResults();
	}
}

menuStartEl.onclick = startQuiz;
quizSubmitEl.onclick = onSubmit;
