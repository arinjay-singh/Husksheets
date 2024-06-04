/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

export const parseOperation = (operation: string) => {
  // ensure the operation is in the correct format
  if (!operation.startsWith("=") || operation.length < 4) {
    return null;
  }

  // extract the arithmetic expression within the parentheses
  const expression = operation.slice(1).trim();

  // exception handling operator with 2 characters
  if (
    expression.match(/^\((\-?\d+\.?\d*)\s*([+\-*/<>]|<>)\s*(\-?\d+\.?\d*)\)$/)
  ) {
    return "TBD";
  }

  // regular expression to match and capture the operation components
  const regex =
    /^\((\-?\d+\.?\d*)\s*([\+\-\*\/<>]|[><&|=:])\s*(\-?\d+\.?\d*)\)$/;
  const match = expression.match(regex);
  if (!match) {
    return null;
  }

  // extract the operands and operator
  const operand1 = match[1].trim();
  const operator = match[2];
  const operand2 = match[3].trim();
  console.log(operand1, operator, operand2);

  if (operator === "=" || operator === ":") {
    // need to implement
    // requires consideration of number and string comparison
    return "TBD";
  }

  if (isNaN(Number(operand1)) || isNaN(Number(operand2))) {
    return "ERROR";
  }

  // Convert operands to numbers
  const num1 = parseFloat(operand1);
  const num2 = parseFloat(operand2);

  // perform the arithmetic operation
  let result: number;
  switch (operator) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        return "#DIV/0!";
      }
      result = num1 / num2;
      break;
    case ">":
      result = num1 > num2 ? 1 : 0;
      break;
    case "<":
      result = num1 < num2 ? 1 : 0;
      break;
    case "&":
      result = num1 !== 0 && num2 !== 0 ? 1 : 0;
      break;
    case "|":
      result = num1 === 1 || num2 === 1 ? 1 : 0;
      break;
    default:
      return null;
  }

  // return the result as a string
  return result.toString();
};

// TODO
export const evaluateFunction = (func: string) => {
  const ifPattern = /^=IF\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/;

  if (func.match(ifPattern)) {
    const match = func.match(ifPattern);
    if (match) {
      const e1 = match[1].trim();
      const e2 = match[2].trim();
      const e3 = match[3].trim();
      console.log(e1, e2, e3);

      const e1Num = parseFloat(e1);
      if (isNaN(e1Num)) {
        return "ERROR";
      }

      if (e1Num !== 0) {
        return e2;
      } else {
        return e3;
      }
    }
  }
};
