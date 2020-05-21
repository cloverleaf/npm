const jsonData = require("./data/sites.json");

const keccak512 = require("js-sha3").keccak512;
Math.seedrandom = require("seedrandom");

const defaultMinLength = 4;
const defaultMaxLength = 512;


const possibleRequirements = {
	cap: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	low: "abcdefghijklmnopqrstuvwxyz",
	num: "0123456789",
	special: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
};


/**
 *
 * @param {string} appName Name of the app to generate a password for
 * @param {string} masterPass
 * @param {number} length int - Desired length of the password
 * @param {boolean} presetToggle True if we want to use a preset
 * @param {string} mode "insecure" for the insecure mode or any other string for the newer password generation
 * @returns {(string|null)} Output password or null if invalid inputs
 */
function process (appName, masterPass, length, presetToggle, mode) {
	let minLength = defaultMinLength;
	let maxLength = defaultMaxLength;
	let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"; // Defualt character set (Set here but overwritten if there's a custom one.)
	const requirements = []; // By default we have no requirements but reset it so we don't carry them over
	let regex; // Blank for the same reason
	appName = appName.trim();
	length = Math.trunc(length); // Get the desired length of a password and make sure it's an integer
	let result = ""; // Has to be here, not in the loop for scope purposes

	// If there's a preset in use
	if (presetToggle) {
		// If it's a site with a preset

		// If it's an alias for another app
		if (jsonData[appName].alias) {
			// Change the name of the app we're using to its alias
			appName = jsonData[appName].alias;
		}

		// If it has a custom minLength
		if ("minLength" in jsonData[appName]) {
			// Replace the default minLength with the supplied one.
			minLength = jsonData[appName].minLength;
		}

		// If it has a custom maxLength
		if ("maxLength" in jsonData[appName]) {
			// Replace the default maxLength with the supplied one.
			maxLength = jsonData[appName].maxLength;
		}

		// If it has a custom character set
		if ("chars" in jsonData[appName]) {
			// Replace the default character set with the supplied one.
			chars = jsonData[appName].chars;
		}

		// If it has a regex
		if ("regex" in jsonData[appName]) {
			// Set the regex to match
			try {
				regex = new RegExp(jsonData[appName].regex);
			} catch (SyntaxError) {
				throw new Error(`Invalid regex from ${appName} "${jsonData[appName].regex}"`);
			}
		}

		if ("requirements" in jsonData[appName]) {
			// TODO This could be a map
			for (let i = 0; i < jsonData[appName].requirements.length; i++) {
				requirements.push(
					possibleRequirements[jsonData[appName].requirements[i]]
				);
			}
		}
	}


	if (!(minLength <= length && length <= maxLength)) {
		// if the length is invalid
		if (length > maxLength) {
			// Too long
			length = maxLength;
		} else if (length < minLength) {
			// Too short
			length = minLength;
		} else {
			// Should never be triggered but better safe than sorry
			length = 16;
			throw new Error("This should never happen");
		}

		// Now we have a sensible value, continue
	}

	// If the appname or password or length are empty
	if (appName === "" || masterPass === "" || length === "") {
		// Empty the output field
		// Stop function from generating new password
		return null;

	}


	// Set the generation seed
	if (mode !== "insecure") {
		Math.seedrandom(keccak512(appName.toLowerCase() + masterPass));
	} else {
		Math.seedrandom(appName.toLowerCase() + masterPass);
	}

	// password generation cycle
	while (true) {
		result = "";
		while (result.length < length) {
			// Add one seeded random character at a time
			result += chars[Math.floor(Math.random() * chars.length)];
		}

		// If there's requirements to forfill
		if (requirements.length !== 0 || regex) {
			let nope = false;
			for (let j = 0; j < requirements.length; j++) {
				// For each requirement
				for (let c = 0; c < requirements[j].length; c++) {
					// For each character in the requirement group

					// Check all characters
					if (result.indexOf(requirements[j][c]) !== -1) {
						// If that character is in the password
						break;
					}

					// If we're on the last character
					if (
						requirements[j].indexOf(requirements[j][c]) === requirements[j].length - 1
					) {
						nope = true;
						break;
					}
				}

				// If it's already failed a requirement
				if (nope) {
					// Don't bother checking the rest
					break;
				}
			}

			// If there's a regex and we've not already failed
			if (regex && !nope) {
				// See if the generated password fails the regex
				if (!regex.test(result)) {
					nope = true;
				}
			}

			if (!nope) {
				// If all tests passed
				break;
				// Stop making new passwords
			}
		} else {
			// No requirements, including regexes
			break;
		}
	}

	// The password has been generated
	return result;
}

exports.process = process;