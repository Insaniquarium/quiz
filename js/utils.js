// In-place Fisher-Yates shuffle
function shuffleArray(array) {
	for (let i = array.length; i;) {
		let r = Math.floor(Math.random() * i--);
		[array[i], array[r]] = [array[r], array[i]];
	}
}

function clearChildren(element) {
	while (element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
}

function capitaliseWord(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

// Uses a recent JavaScript feature, thus needs a browser made past early 2025
function formatDuration(ms) {
	const duration = {
		minutes: Math.floor((ms / 60000) % 60),
		seconds: Math.floor((ms / 1000) % 60)
	};
	return new Intl.DurationFormat("en").format(duration);
}
