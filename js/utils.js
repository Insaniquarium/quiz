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
