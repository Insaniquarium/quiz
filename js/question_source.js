const openTDBEndpoint = "https://opentdb.com/api.php";

async function fetchQuestionsFromOpenTDB(category, difficulty, amount) {
	if (amount > 50)
		throw new RangeError("Requesting more than 50 questions from OpenTDB requires an API key");

	// URLSearchParams converts undefined keys to "undefined" as a string, not good
	if (!category)
		category = "";

	// Making a URL object and setting its search property would be a more proper way than just appending to a URL string
	const params = new URLSearchParams({ category, difficulty, amount, type: "multiple" });
	const response = await fetch(openTDBEndpoint + "?" + params); // OpenTDB does no-cache for us

	if (!response.ok)
		throw new Error(`Failed to query OpenTDB; got HTTP ${response.status}`);

	const result = await response.json();

	if (result?.response_code != 0)
		throw new Error(`Failed to query OpenTDB; got response code ${result.response_code}`);

	/**
	 * Convert to our format.
	 * The reasoning why our answers are in objects in an array is that it is more extensible.
	 * That way, you could implement having questions that ask for all applicable options, in the
	 * form of checkboxes and not radio buttons.
	 * Architecting around this inherently introduces more complexity however.
	 */
	return result.results.map(question => ({
		"question": question.question,
		"answers": [
			{ text: question.correct_answer, correct: true },
			...question.incorrect_answers.map(answer => ({ text: answer, correct: false }))
		]
	}));
}

// Doing this with category ID prefixes allows for multiple question sources, whenever that may be
async function fetchQuestionsByMenuID(id, difficulty, amount) {
	if (id.startsWith("tdb-")) {
		return fetchQuestionsFromOpenTDB(id.slice(4), difficulty, amount);
	} else {
		throw new Error(`Unknown category ID "${id}"`);
	}
}
