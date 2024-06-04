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
  const regex = /^\((\-?\d+\.?\d*)\s*([\+\-\*\/])\s*(\-?\d+\.?\d*)\)$/;
  const match = expression.match(regex);
  if (!match) {
    return null;
  }

  // extract the operands and operator
  const operand1 = parseFloat(match[1]);
  const operator = match[2];
  const operand2 = parseFloat(match[3]);

  // perform the arithmetic operation
  let result: number;
  switch (operator) {
    case "+":
      result = operand1 + operand2;
      break;
    case "-":
      result = operand1 - operand2;
      break;
    case "*":
      result = operand1 * operand2;
      break;
    case "/":
      if (operand2 === 0) {
        return "#DIV/0!";
      }
      result = operand1 / operand2;
      break;
    default:
      return null;
  }

  // return the result as a string
  return result.toString();
};
