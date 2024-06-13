/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import { parseCellReferences } from "./cell-referencing";

// function to parse and evaluate a standard mathematical operation
export const parseEquation = (data: string[][], equation: string) => {
  // remove all spaces from the equation
  equation = equation.replace(/\s/g, "");
  // ensure the operation is in the correct format
  if (!equation.startsWith("=") || equation.length < 4) {
    return null;
  }

  // parse cell references
  equation = parseCellReferences(data, equation);

  // extract the arithmetic expression
  const expression = equation.slice(1).trim();

  // list of non-standard operations
  const nonstandardOperations = ["=", "<>", "|", "&"];
  // check if the expression is a non-standard operation
  if (nonstandardOperations.some((op) => expression.includes(op))) {
    const nonstandardFormat = /^(\d+|\w+)(=|<>|&|\|)(\d+|\w+)$/;
    const nonstandardMatch = expression.match(nonstandardFormat);
    if (!nonstandardMatch) {
      return "ERROR";
    }
    // check that both elements are of the same type
    const [, e1, operator, e2] = nonstandardMatch;
    const isNumber = (str: string) => /^\d+$/.test(str);
    const isString = (str: string) => /^[a-zA-Z]+$/.test(str);
    if (!(isNumber(e1) && isNumber(e2)) && !(isString(e1) && isString(e2))) {
      return "ERROR";
    }
    // evaluate the non-standard operation
    switch (operator) {
      case "=":
        return e1 === e2 ? "1" : "0";
      case "<>":
        return e1 !== e2 ? "1" : "0";
      case "|":
        if (isString(e1)) return "ERROR";
        return parseFloat(e1) === 1 || parseFloat(e2) === 1 ? "1" : "0";
      case "&":
        if (isString(e1)) return "ERROR";
        return parseFloat(e1) !== 0 && parseFloat(e2) !== 0 ? "1" : "0";
      default:
        return "ERROR";
    }
  }

  // check if the expression contains anything other than numbers and operators
  // security vulnerability
  const regex = /^([0-9+\-*/<>|&=:.\s()]+)$/;
  if (!regex.test(expression)) {
    return null;
  }

  // evaluate the function
  const funcResult = eval(expression);

  console.log(funcResult);
  console.log(typeof funcResult);

  // in case of a boolean result, return 1 or 0
  if (funcResult === true) {
    return "1";
  } else if (funcResult === false) {
    return "0";
  }

  // return the result as a string
  return funcResult.toString();
};
