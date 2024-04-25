import * as fs from 'node:fs/promises';

let text = await fs.readFile("./input.txt", { encoding: 'utf8' });
let lines = text.split("\n");

let accumulator = 0;
for (let i = 0; i < lines.length; i++) {
	let number = (firstNumeralFromString(lines[i]) * 10) +
		(lastNumeralFromString(lines[i]));
	accumulator += number;
}

console.log("Result:");
console.log(accumulator);

function firstNumeralFromString(input) {
	for (let j = 0; j < input.length; j++) {

		let charCode = input.charCodeAt(j);
		//	Remap ASCII to numerals
		if (charCode >= 48 && charCode < 58) {
			return charCode -= 48;
		}
	}
}

function lastNumeralFromString(input) {
	for (let j = input.length; j >= 0; j--) {

		let charCode = input.charCodeAt(j);
		//	Remap ASCII to numerals
		if (charCode >= 48 && charCode < 58) {
			return charCode -= 48;
		}
	}
}