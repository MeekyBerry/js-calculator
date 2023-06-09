const currValue = document.getElementById("curr");
const prevValue = document.getElementById("prev");
const operatorBtn = document.querySelectorAll(".operator");
const numBtn = document.querySelectorAll(".num");
const clearBtn = document.querySelector(".clear");
const delBtn = document.querySelector(".del");
const equalBtn = document.querySelector(".equalTo");

const MUL_SYMBOL = '×';
const DIV_SYMBOL = '÷'

// Math functions
function add(num1, num2) {
    return num1 + num2;
}

function sub(num1, num2) {
    return num1 - num2;
}

function mul(num1, num2) {
    return num1 * num2;
}

function div(num1, num2) {
    return num1 / num2;
}

// Formatting function to fit number to screen by constants
const MAX_NUM_LENGTH = 14;  // number of digits that fit to screen
const LARGE_NUMBER = 1e14;   // what is considered a large number (should match the MAX_NUM_LENGTH)
const MAX_EXP_LENGTH = 5; // number of digits for exponential notation
const MAX_FRACTION_DIGITS = 6;

function formatNumber(x) {
  let str = x.toString();
  let numDigits = str.replace(".", "").length;

  if (numDigits <= MAX_NUM_LENGTH) {
    // The number is short, constrain fractional digits      
    let decimalPos = str.indexOf('.');
    let numFracDigits = decimalPos === -1 ? 0 : str.length - decimalPos - 1;
    let actualFracDigits = Math.min(MAX_FRACTION_DIGITS, numFracDigits);
    if (actualFracDigits < 0) {
      str = x.toPrecision(MAX_NUM_LENGTH - 1);
    } else {
      str = x.toFixed(actualFracDigits);
    }
  } else if (Math.abs(x) >= LARGE_NUMBER) {
    // The number is very large, use exponential notation
    str = x.toExponential(MAX_NUM_LENGTH - MAX_EXP_LENGTH);
  } else {
    // The number is not too large, use fixed or precision notation
    let numIntDigits = Math.floor(Math.log10(Math.abs(x))) + 1;
    let numFracDigits = MAX_NUM_LENGTH - numIntDigits - 1;
    let actualFracDigits = Math.min(MAX_FRACTION_DIGITS, numFracDigits);

    if (actualFracDigits < 0) {
      str = x.toPrecision(MAX_NUM_LENGTH - MAX_EXP_LENGTH);
    } else {
      // Use fixed notation with the appropriate number of fractional digits
      str = x.toFixed(actualFracDigits);
    }
  }

  // Remove trailing zeros
  str = str.replace(/(\.\d*?)0+$/, '$1');
  return str;
}

// Calculation and Parsing functions
function tokenize(expression) {
  const tokens = [];
  let currentToken = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (/\s/.test(char)) {
      continue;
    }
    if (/[+\-*÷/×()]/.test(char)) {
      if (currentToken !== '') {
        tokens.push(parseFloat(currentToken));
        currentToken = '';
      }
      tokens.push(char);
    } else if (/\d/.test(char) || char === '.') {
      currentToken += char;
    } else {
      throw new Error(`Invalid character: ${char}`);
    }
  }
  if (currentToken !== '') {
    tokens.push(parseFloat(currentToken));
  }
  return tokens;
}


function evaluateTokens(tokens) {
  let result = parseFloat(tokens[0]); // Initialize result with the first number token

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const number = parseFloat(tokens[i + 1]);

    switch (operator) {
      case '+':
        result = add(result, number);
        break;
      case '-':
        result = sub(result, number);
        break;
      case '×':
        result = mul(result, number);
        break;
      case '÷':
        result = div(result, number);
        break;
      default:
        throw new Error('Invalid operator: ' + operator);
    }
  }

  return result;
}

// User interface and input functions
let curr = "";
let prev = "";
let afterRezult = false;

const display = () => {
  currValue.innerText = curr;
  prevValue.innerText = prev;
};

const clearAfterRezult = () => {
  if (afterRezult){
    prev = "";
    afterRezult = false;
  }
}

function endsWithOperator(input) {
  isTrue = false;

  // check if equation doesnt end with an operator symbol
  operatorBtn.forEach(op =>{
    endSymbol = input.slice(-1);
    if (input.endsWith(op.innerText)){
      isTrue = true;
      return isTrue;
    }
  });

  return isTrue;
}

const operation = () => {
  operatorBtn.forEach((operator) => {
    operator.addEventListener("click", () => {
      // Clear previous input field and update it with current input 
      clearAfterRezult();
      if(endsWithOperator(curr)) {
        // Change operators if current input line ends with one
        prev = curr.slice(0, -1);
        prev += operator.innerText;
        curr = "";
        display();
        return;
      }
      if(endsWithOperator(prev) && curr === "") {
        // Change operators if previous input line ends with one and no new number entered
        prev = prev.slice(0, -1);
        prev += operator.innerText;
        display();
        return;
      }
      if (curr === "") return;
      if (prev !== "") {
        // Add new number from current input to previous input that already should contain an operator
        prev += curr;
        // Calculate result and update previous input line
        prev = formatNumber(evaluateTokens(tokenize(prev)));
      } else {
        // If previous input was empty set it to current input number
        prev = curr;
      }
      // Add pressed operator to previous input
      prev += operator.innerText;
      curr = "";
      display();
    });
  });
};

operation();

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default behavior
    return false;
  }
});

const equalsListener = () => {
  equalBtn.addEventListener("click", () => {
    clearAfterRezult();
    if(endsWithOperator(curr)
    || (curr == "" && endsWithOperator(prev))
    || (curr == "" && prev == ""))
      return;

    prev += curr;
    curr = formatNumber(evaluateTokens(tokenize(prev)));
    // prev += "";
    afterRezult = true;
    display();
  });
};

equalsListener();

const buttons = () => {
  numBtn.forEach((num) => {
    num.addEventListener("click", () => {
      if(endsWithOperator(curr)) {
        prev = curr;
        curr = "";
      }
      clearAfterRezult();
      // limit '0' inputs
      if (curr === "0" && num.innerText == "0") {
        return;
      }
      if (num.classList.contains("dot")) {
        if (curr.includes(".") || curr === "") {
          return;
        } else {
          curr += num.innerText;
        }
      } else if (num.classList.contains("zero")) {
        if (prev.endsWith(DIV_SYMBOL) && curr === "")
        {
          alert("Can't compute division by Zero\n💫🤖💫")
          return;
        }
        curr += num.innerText;
      } 
      else{
        curr += num.innerText;
      }
      display();
    });
  });
};

buttons();

const clear = () => {
  clearBtn.addEventListener("click", () => {
    curr = "";
    prev = "";
    afterRezult = false;
    display();
  });
};

clear();

const del = () => {
  delBtn.addEventListener("click", () => {
    if (curr == "" && prev !== "") {
      curr = prev;
      prev = "";
    }
    // stop after rezult display clear after previous input line starts being edited (deleted)
    if (afterRezult && prev === "")
      afterRezult = false;

    curr = curr.slice(0, -1);
    display();
  });
};

del();

// Keyboard input support
function clickNumber(key) {
  numBtn.forEach((button) => {
    if (button.innerText === key) {
      button.click()
    }
  })
}

function clickOperator(key) {
  operatorBtn.forEach((button) => {
    if (button.innerText === key) {
      button.click()
    }
  });
}

function clickEquals() {
  equalBtn.click()
}

function clickDel() {
  delBtn.click()
}

function clickClear() {
  clearBtn.click()
}
window.addEventListener('keydown', (e) => {
  if (e.key === '0'
  || e.key === '1'
  || e.key === '2'
  || e.key === '3'
  || e.key === '4'
  || e.key === '5'
  || e.key === '6'
  || e.key === '7'
  || e.key === '8'
  || e.key === '9'
  || e.key === '.') {
    clickNumber(e.key)
  } else if (e.key === '+' || e.key === '-') {
    clickOperator(e.key)
  } else if (e.key === '*') {
    clickOperator(MUL_SYMBOL)
  } else if (e.key === '/') {
    clickOperator(DIV_SYMBOL)
  } else if (e.key === 'Enter' || e.key === '=') {
    clickEquals()
  } else if (e.key === 'Backspace') {
    clickDel()
  } else if (e.key === 'Delete' || e.key === 'Escape') {
    clickClear()
  }
});
