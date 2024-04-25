import * as fs from 'node:fs/promises';

const testData = "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen";
const text = await fs.readFile("./input.txt", { encoding: 'utf8' });

const textStrings = ["one", "two", "three", "four", "five",
	"six", "seven", "eight", "nine"];

const lines = text.split("\n");

let accumulator = 0;
console.time("parse");
for (let i = 0; i < lines.length; i++) {
	const firstNumber = first(lines[i]);
	const lastNumber = last(lines[i]);

	const number = (firstNumber * 10) + lastNumber;

	accumulator += number;
}
console.timeEnd("parse");
console.log(`Result: ${accumulator}`);


function first(input) {
	//	Finding the first number or word

	let firstNumber = firstNumeralFromString(input);
	if (firstNumber.match) {
		//	If we match a number before index 3 we don't have to check for the costly words because they're all more than 3 chars long
		if (firstNumber.index < 3) {
			return firstNumber.numeral;
		}
	}

	const endIndex = firstNumber.match ? firstNumber.index : input.length;
	//	Look for word matches, but only up to the index of the first number we found
	let firstWord = firstWordFromString(input, endIndex);
	if (firstWord.match) {
		if (!firstNumber.match) {
			return firstWord.wordIndex + 1;
		}
		else {
			//	If the string contains both words and numbers
			if (firstWord.startingIndex < firstNumber.index) {
				return firstWord.wordIndex + 1;
			} else {
				return firstNumber.numeral;
			}
		}
	}
	else if (firstNumber.match) {
		return firstNumber.numeral;
	}

	console.log("Input error: No first match!");
	return (0);
}

function last(input) {
	//	Finding the last number or word

	let lastNumber = lastNumeralFromString(input);
	if (lastNumber.match) {
		//	If we match a number before index 3 we don't have to check for the costly words (they're all too long to fit)
		if (lastNumber.index > input.length - 3) {
			return lastNumber.numeral;
		}
	}

	const startIndex = lastNumber.match ? lastNumber.index : 0;
	//	Look for word matches, but only starting from the index of the first number we found
	let firstWord = lastWordFromString(input, startIndex);
	if (firstWord.match) {
		if (!lastNumber.match) {
			return firstWord.wordIndex + 1;
		}
		else {
			//	If the string contains both words and numbers
			if (firstWord.startingIndex > lastNumber.index) {
				return firstWord.wordIndex + 1;
			} else {
				return lastNumber.numeral;
			}
		}
	}
	else if (lastNumber.match) {
		return lastNumber.numeral;
	}

	console.log("Input error: No last match!");
	return (0);
}

function firstNumeralFromString(input) {
	let result = { match: false, numeral: -1, index: 0 };

	for (let j = 0; j < input.length; j++) {

		let charCode = input.charCodeAt(j);
		//	Remap ASCII to numerals
		if (charCode >= 48 && charCode < 58) {
			result = { match: true, numeral: charCode - 48, index: j };
			return result;
		}
	}

	return result;
}

function firstWordFromString(input, numeralIndex = Number.MAX_SAFE_INTEGER) {

	let result = { match: false, wordIndex: 0, startingIndex: input.length };
	let setResult = (r) => result = r;

	//	Loop over all the possible words to match to the string
	for (let i = 0; i < textStrings.length; i++) {
		//	Adding 2 here to the last result index is an optimization as none of our words can overlap by more than one character
		const lastIndex = Math.min(numeralIndex + 1, result.startingIndex + 2);
		const maxIndex = Math.min(lastIndex - textStrings[i].length, input.length - textStrings[i].length);
		checkWordMatchFromStart(input, maxIndex, i, result, setResult);
	}

	return result;
}

function checkWordMatchFromStart(input, maxIndex, i, result, setResult) {
	for (let j = 0; j < maxIndex; j++) {
		//	Loop over each letter in the word we want to match
		for (let k = 0; k < textStrings[i].length; k++) {
			//	If they do not match, break
			if (input[j + k] !== textStrings[i][k]) {
				break;
			}
			//	If we fell through for the whole word, it matched. Store it and it's starting index
			if (k === textStrings[i].length - 1) {
				if (j < result.startingIndex || !result.match) {
					setResult({ match: true, wordIndex: i, startingIndex: j });
				}
				return;
			}
		}
	}
}

function lastNumeralFromString(input) {
	let result = { match: false, numeral: -1, index: 0 };

	for (let j = input.length; j >= 0; j--) {

		let charCode = input.charCodeAt(j);
		//	Remap ASCII to numerals
		if (charCode >= 48 && charCode < 58) {
			result = { match: true, numeral: charCode - 48, index: j };
			return result;
		}
	}

	return result;
}

function lastWordFromString(input, numeralIndex = 0) {

	let result = { match: false, wordIndex: 0, startingIndex: 0 };
	let setResult = (r) => result = r;

	//	Loop over all the possible words to match to the string
	for (let i = 0; i < textStrings.length; i++) {

		//	Subbing 2 here to the last result index is an optimization as none of our words can overlap by more than one character
		const minIndex = Math.max(0, Math.max(numeralIndex - 1, result.startingIndex - 2));
		checkWordMatchFromEnd(input, minIndex, i, result, setResult);
	}

	return result;
}

function checkWordMatchFromEnd(input, minIndex, i, result, setResult) {
	for (let j = input.length - textStrings[i].length; j >= minIndex; j--) {
		//	Loop over each letter in the word we want to match
		for (let k = 0; k < textStrings[i].length; k++) {
			//	If they do not match, break
			if (input[j + k] !== textStrings[i][k]) {
				break;
			}
			//	If we fell through for the whole word, it matched. Store it and it's starting index
			if (k === textStrings[i].length - 1) {
				if (j > result.startingIndex || !result.match) {
					setResult({ match: true, wordIndex: i, startingIndex: j });
				}
				return;
			}
		}
	}
}