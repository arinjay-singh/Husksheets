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

  // regular expression to match and capture the operation components
  const regex = /^\(([^()]+)\s*([\S]+)\s*([^()]+)\)$/;
  const match = expression.match(regex);
  if (!match) {
    return null;
  }

  // extract the operands and operator
  const operand1 = match[1].trim();
  const operator = match[2];
  const operand2 = match[3].trim();

  if (operator === "=" || operator === "<>" || operator === ":") {
    // need to implement
    // requires consideration of number and string comparison
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
      console.log('here')
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
