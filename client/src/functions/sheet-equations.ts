/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

export const parseEquation = (equation: string) => {
  // ensure the operation is in the correct format
  if (!equation.startsWith("=") || equation.length < 4) {
    return null;
  }

  // extract the arithmetic expression
  const expression = equation.slice(1).trim();

  // check if the expression is a simple operation
  if (
    expression.includes("=") ||
    expression.includes("<>") ||
    expression.includes(":") ||
    expression.includes("&") ||
    expression.includes("|")
  ) {
    return null;
  }

  // check if the expression contains anything other than numbers and operators
  // security vulnerability
  const regex = /^([0-9+\-*/<>|&=:.\s()]+)$/;
  if (!regex.test(expression)) {
    return null;
  }

  // evaluate the function
  const funcResult = eval(expression);

  // return the result as a string
  return funcResult.toString();
};
