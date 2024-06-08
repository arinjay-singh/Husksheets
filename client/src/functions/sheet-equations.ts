/**
 * @file sheet-equations.ts
 * @brief A simple function to parse and evaluate simple mathematical operations.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import {
  parseCellReferences,
  retrieveCellRangeValues,
} from "./cell-referencing";

// function to parse and evaluate a standard mathematical operation
export const parseEquation = (equation: string) => {
  // remove all spaces from the equation
  equation = equation.replace(/\s/g, "");
  // ensure the operation is in the correct format
  if (!equation.startsWith("=") || equation.length < 4) {
    return null;
  }

  // extract the arithmetic expression
  const expression = equation.slice(1).trim();

  // list of non-standard operations
  const nonstandardOperations = ["=", "<>", "|", "&"];
  // check if the expression is a non-standard operation
  if (nonstandardOperations.some((op) => expression.includes(op))) {
    const nonstandardFormat = /^(\d+|\w+)(=|<>|&|\|)(\d+|\w+)$/;
    const nonstandardMatch = expression.match(nonstandardFormat);
    if (!nonstandardMatch) {
      return 'ERROR';
    }
    // check that both elements are of the same type
    const [, e1, operator, e2] =nonstandardMatch;
    const isNumber = (str: string) => /^\d+$/.test(str);
    const isString = (str: string) => /^[a-zA-Z]+$/.test(str);
    if (!(isNumber(e1) && isNumber(e2)) && !(isString(e1) && isString(e2))) {
      return 'ERROR';
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

  // return the result as a string
  return funcResult.toString();
};

const validValues = (values: string[]): boolean => {
  // define the regex formats
  const regexFormats: RegExp[] = [
    /^\$[A-Z]+\d+$/, // cell reference format
    /^\d+(\.\d+)?$/, // number format (integer or decimal)
  ];

  return values.every((value) =>
    regexFormats.some((regex) => regex.test(value))
  );
};

// function to parse and evaluate a function
export const parseFunction = (data: string[][], formula: string) => {
  // remove all spaces from the formula
  formula = formula.replace(/\s/g, "");
  // ensure the operation is in the correct format
  if (!formula.startsWith("=") || formula.length < 4) {
    return null;
  }
  // comma-separated function format
  const commaSeparatedFunction = /=([a-zA-Z]{2,6})\(([^)]+)\)/;
  const commaSeparatedMatch = formula.match(commaSeparatedFunction);
  // range function format
  const rangeFunction = /=([A-Za-z]{3,6})\(\$[A-Za-z]+\d+:\$[A-Za-z]+\d+\)/;
  const rangeMatch = formula.match(rangeFunction);

  // check if the formula is a function
  if (commaSeparatedMatch) {
    // check if a range function
    if (formula.includes(":") && rangeMatch) {
      // execute the range function
      const cellRange = rangeMatch[0].match(/\(([^)]+)\)/)?.[1];
      if (!cellRange) {
        return null;
      }
      const [startCell, endCell] = cellRange.split(":");
      console.log(startCell, endCell);
      const cellValues = retrieveCellRangeValues(startCell, endCell, data);
      return computeFunction(rangeMatch[1], cellValues);
    }
    // execute the comma-separated function
    const functionValues = commaSeparatedMatch[2]
      .split(",")
      .map((value) => value.trim());
    if (!validValues(functionValues)) {
      return null;
    }
    const parsedFunctionValues = functionValues.map((value) =>
      parseCellReferences(data, value)
    );
    return computeFunction(commaSeparatedMatch[1], parsedFunctionValues);
  }
  // return null if the formula is not a function
  return null;
};

// function to compute the result of a function
const computeFunction = (func: string, values: string[]): string | null => {
  // store the numbers for the function
  let nums: number[];
  // if there are no values, return null
  if (values.length === 0) {
    return null;
  }
  try {
    // switch statement to determine the function
    switch (func) {
      case "SUM":
        nums = values.map((value) => parseFloat(value));
        return nums.reduce((acc, curr) => acc + curr, 0).toString();
      case "AVG":
        nums = values.map((value) => parseFloat(value));
        return (
          nums.reduce((acc, curr) => acc + curr, 0) / nums.length
        ).toString();
      case "MAX":
        nums = values.map((value) => parseFloat(value));
        return Math.max(...nums).toString();
      case "MIN":
        nums = values.map((value) => parseFloat(value));
        return Math.min(...nums).toString();
      case "CONCAT":
        return values.join("");
      case "IF":
        if (values.length !== 3) {
          return null;
        }
        return parseFloat(values[0]) !== 0 ? values[1] : values[2];
      case "DEBUG":
        if (values.length !== 1) {
          return null;
        }
        return values[0];
      default:
        return "";
    }
  } catch (e) {
    return null;
  }
};
