const copyButton = document.getElementById("copy-btn");
const passInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const upperCaseCheckBox = document.getElementById("uppercase");
const lowerCaseCheckBox = document.getElementById("lowercase");
const numberCheckBox = document.getElementById("numbers");
const symbolCheckBox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLettrs = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_<>\|/";

lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
    const length = Number(lengthSlider.value);
    const incUpper = upperCaseCheckBox.checked;
    const inclower = lowerCaseCheckBox.checked;
    const incNum = numberCheckBox.checked;
    const incSymb = symbolCheckBox.checked;

    if (!incUpper && !inclower && !incNum && !incSymb) {
        alert("Select atleast one charater type");
        return;
    }

    const newPassword = createPassword(length, incUpper, inclower, incNum, incSymb);

    passInput.value = newPassword

    updateStrengthMeter(newPassword);
}

function createPassword(length, incUpper, inclower, incNum, incSymb) {
    let allChars = "";

    if (incUpper) allChars += uppercaseLetters;
    if (inclower) allChars += lowercaseLettrs;
    if (incNum) allChars += numberCharacters;
    if (incSymb) allChars += symbolCharacters;

    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    return password;
}

function updateStrengthMeter(pass) {
    const passwordLength = pass.length;

    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSymbols = /[!@#$%^&*()\-_</>|]/.test(pass);

    let strengthScore = 0;

    // 1. Length contribution (logarithmic, capped)
    if (passwordLength > 0) {
        strengthScore += Math.min(30, Math.log2(passwordLength) * 10);
    }

    // 2. Character variety contribution
    let variety = 0;
    if (hasUpperCase) variety++;
    if (hasLowerCase) variety++;
    if (hasNumbers) variety++;
    if (hasSymbols) variety++;

    strengthScore += variety * 12;

    // 3. Short password hard cap
    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    // 4. Normalize score to 0–100 so bar can reach full width
    const maxScore = 30 + (4 * 12); // length cap + all 4 variety types
    const safeScore = Math.min(100, Math.max(5, (strengthScore / maxScore) * 100));

    // 5. Visual strength bar logic
    let strengthLabelText = "";
    let barColor = "";
    let visualFill = safeScore;

    if (safeScore < 45) {
        barColor = "#cb540a";
        strengthLabelText = "Weak";
        visualFill = Math.max(10, Math.min(safeScore, 45));
    }
    else if (safeScore < 75) {
        barColor = "#ffa200";
        strengthLabelText = "Medium";
        visualFill = Math.max(45, Math.min(safeScore, 75));
    }
    else {
        barColor = "#44d83a";
        strengthLabelText = "Strong";
        visualFill = Math.max(75, safeScore);
    }

    // 6. Apply UI updates
    strengthBar.style.width = visualFill + "%";
    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

window.addEventListener("DOMContentLoaded", makePassword);

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(passInput.value)
        .then(() => showCopySuccess())
        .catch((error) => console.log("Could not copy:", error));
})

function showCopySuccess() {
    copyButton.classList.remove("far", "fa-copy")
}