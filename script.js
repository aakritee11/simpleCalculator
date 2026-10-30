// ----- Screen elements -----
const mainDisplay = document.getElementById("current");
const historyDisplay = document.getElementById("history");

// ----- Calculator memory -----
let currentNumber = "0";      // number shown on screen (kept as text)
let firstNumber = null;       //  number saved before choosing an operator
let operator = null;          // "+", "-", "*" or "/"
let startNewNumber = false;   // true = next digit replaces the screen


const operatorSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };


// ----- Helpers -----
function updateScreen(historyText) {
  mainDisplay.textContent = currentNumber;

  if (historyText !== undefined) {
    historyDisplay.textContent = historyText;
  } else if (firstNumber !== null && operator !== null) {
    historyDisplay.textContent = firstNumber + " " + operatorSymbols[operator];
  } else {
    historyDisplay.textContent = "";
  }
}

function fixRounding(number) {
  return String(parseFloat(number.toPrecision(12)));
}

function calculate(a, b, op) {
  const x = Number(a);
  const y = Number(b);

  if (op === "+") return fixRounding(x + y);
  if (op === "-") return fixRounding(x - y);
  if (op === "*") return fixRounding(x * y);
  if (op === "/") {
    if (y === 0) return "Error";
    return fixRounding(x / y);
  }
}


// ----- Button actions -----
function appendNumber(digit) {
  if (startNewNumber || currentNumber === "0") {
    currentNumber = digit;
  } else {
    currentNumber = currentNumber + digit;
  }
  startNewNumber = false;
  updateScreen();
}

function appendDecimal() {
  if (startNewNumber) {
    currentNumber = "0";
    startNewNumber = false;
  }
  if (!currentNumber.includes(".")) {
    currentNumber = currentNumber + ".";
  }
  updateScreen();
}

function chooseOperator(newOperator) {
  if (currentNumber === "Error") return;

 
  if (operator !== null && !startNewNumber) {
    currentNumber = calculate(firstNumber, currentNumber, operator);
  }

  firstNumber = currentNumber;
  operator = newOperator;
  startNewNumber = true;
  updateScreen();
}

function pressEquals() {
  if (operator === null || currentNumber === "Error") return;

  const historyText =
    firstNumber + " " + operatorSymbols[operator] + " " + currentNumber + " =";

  currentNumber = calculate(firstNumber, currentNumber, operator);
  firstNumber = null;
  operator = null;
  startNewNumber = true;
  updateScreen(historyText);
}

function clearAll() {
  currentNumber = "0";
  firstNumber = null;
  operator = null;
  startNewNumber = false;
  updateScreen();
}

function deleteLast() {
  if (startNewNumber || currentNumber === "Error") return;

  currentNumber = currentNumber.slice(0, -1);
  if (currentNumber === "" || currentNumber === "-") {
    currentNumber = "0";
  }
  updateScreen();
}

function toggleSign() {
  if (currentNumber === "0" || currentNumber === "Error") return;

  if (currentNumber.startsWith("-")) {
    currentNumber = currentNumber.slice(1);
  } else {
    currentNumber = "-" + currentNumber;
  }
  updateScreen();
}

function makePercent() {
  if (currentNumber === "Error") return;

  currentNumber = fixRounding(Number(currentNumber) / 100);
  updateScreen();
}


// ----- Mouse / touch clicks -----
const keypad = document.querySelector(".keys");

keypad.addEventListener("click", function (event) {
  // closest() makes sure clicking the icon inside a button still works
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.num !== undefined) {
    appendNumber(button.dataset.num);
  } else if (button.dataset.op !== undefined) {
    chooseOperator(button.dataset.op);
  } else if (button.dataset.action === "decimal") {
    appendDecimal();
  } else if (button.dataset.action === "equals") {
    pressEquals();
  } else if (button.dataset.action === "clear") {
    clearAll();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  } else if (button.dataset.action === "negate") {
    toggleSign();
  } else if (button.dataset.action === "percent") {
    makePercent();
  }
});


// ----- Keyboard -----
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (key === ".") {
    appendDecimal();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault(); // stops Enter from re-clicking a focused button
    pressEquals();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  } else if (key === "%") {
    makePercent();
  }
});


// ----- Start -----
updateScreen();