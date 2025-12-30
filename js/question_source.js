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

async function fetchQuestionsFromOpenTDB(category, difficulty, amount) {
	if (amount > 50)
		throw new RangeError("Requesting more than 50 questions from OpenTDB requires an API key");

	/**
	 * Thankfully, 0 is recognised as a valid category ID, so we don't
	 * need to conditionally remove category if it is undefined.
	 */
	const params = new URLSearchParams({ category, difficulty, amount });
	const response = await fetch("https://opentdb.com/api.php?" + params); // OpenTDB does no-cache for us
	const result = await response.json();

	// Convert to our format
	return result.results.map(question => ({
		"question": question.question,
		"answers": [
			{ text: question.correct_answer, correct: true },
			...question.incorrect_answers.map(answer => ({ text: answer, correct: false }))
		]
	}));
}

async function fetchQuestionsByMenuID(id, difficulty, amount) {
	if (id.startsWith("tdb-")) {
		return fetchQuestionsFromOpenTDB(id.slice(4), difficulty, amount);
	}
}
