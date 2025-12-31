async function fetchQuestionsFromOpenTDB(category, difficulty, amount) {
	if (amount > 50)
		throw new RangeError("Requesting more than 50 questions from OpenTDB requires an API key");

	// URLSearchParams converts undefined keys to "undefined" as a string, not good
	if (!category)
		category = "";

	const params = new URLSearchParams({ category, difficulty, amount });
	const response = await fetch("https://opentdb.com/api.php?" + params); // OpenTDB does no-cache for us

	if (!response.ok)
		throw new Error(`Failed to query OpenTDB; got HTTP ${response.status}`)

	const result = await response.json();

	if (result?.response_code != 0)
		throw new Error(`Failed to query OpenTDB; got response code ${result.response_code}`)

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
	} else {
		throw new Error(`Unknown category ID "${id}"`);
	}
}
