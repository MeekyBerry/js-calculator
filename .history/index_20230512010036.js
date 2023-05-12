const currValue = document.getElementById("curr");
const prevValue = document.getElementById("prev");
const Result = document.getElementById("result");
const operatorBtn = document.querySelectorAll(".operator");
const numBtn = document.querySelectorAll(".num");
const clearBtn = document.querySelector(".clear");
const delBtn = document.querySelector(".del");
const equalBtn = document.querySelector(".equalTo");

let curr = "";
let prev = "";
let result = "";
let operator = "";

const display = () => {
  currValue.innerText = curr;
  prevValue.innerText = prev;
  Result.innerText = result;
};

clearBtn.addEventListener("click", () => {
  curr = "";
  prev = "";
  result = "";
  display();
});

delBtn.addEventListener("click", () => {
  curr = curr.slice(0, -1);
  display();
});

numBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.innerText === "." && curr.includes(".")) return;
    curr += btn.innerText;
    display();
  });
});

const isNumberOrCloseParen = (input) => {
  return !isNaN(input) || input === ")";
};

operatorBtn.forEach((op) => {
  op.addEventListener("click", () => {
    if (curr === "") return;
    if (isNumberOrCloseParen(prev.charAt(prev.length - 1))) {
      operator = op.innerText;
      curr += operator;
      // curr = "";
      display();
    }
    // operator = op.innerText;
    // curr += operator;
    // display();
  });
});

equalBtn.addEventListener("click", () => {
  if (curr === "" || prev === "") return;
  // calculation function
  display();
});
